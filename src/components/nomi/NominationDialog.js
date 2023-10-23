import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import {
  useExtensions,
  useExtensionAccounts,
} from '@polkadot-cloud/react/hooks';
import Identicon from '@polkadot/react-identicon';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import EnkryptSVG from "@polkadot-cloud/assets/extensions/svg/enkrypt.svg?react";
import FearlessWalletSVG from "@polkadot-cloud/assets/extensions/svg/fearlesswallet.svg?react";
import NovaWalletSVG from "@polkadot-cloud/assets/extensions/svg/novawallet.svg?react";
import PolkadotJSSVG from "@polkadot-cloud/assets/extensions/svg/polkadotjs.svg?react";
import PolkaGateSVG from "@polkadot-cloud/assets/extensions/svg/polkagate.svg?react";
import SubwalletJSSVG from "@polkadot-cloud/assets/extensions/svg/subwalletjs.svg?react";
import TalismanSVG from "@polkadot-cloud/assets/extensions/svg/talisman.svg?react";
import { ReactComponent as NominationIcon } from '../../assets/polkadot_icons/nominating_dark.svg';
import {
  selectValProfileByAddress,
} from '../../features/api/valProfilesSlice';
import {
  selectCandidates
} from '../../features/api/boardsSlice';
import {
  selectChain,
} from '../../features/chain/chainSlice';
import { stashDisplay, nameDisplay, hashDisplay } from '../../util/display'
import { Typography } from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme, maxWidth }) => ({
  '& .MuiDialog-paper': {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(0),
    backgroundColor: theme.palette.primary.main,
    maxHeight: 435,
  },
}));

const getBondedAccounts = (api, accounts = []) => {
  const calls = accounts.map(acc => {
    return api.query.staking.bonded(acc.address)
  })
  // Retrieve the chain & node information information via rpc calls
  return Promise.all(calls);
}

const extensionIcon = {
  "encrypt": EnkryptSVG,
  "fearless-wallet": FearlessWalletSVG,
  "talisman": TalismanSVG,
  "polkadot-js": window.walletExtension?.isNovaWallet ? NovaWalletSVG : PolkadotJSSVG,
  "polkagate": PolkaGateSVG,
  "subwallet-js": SubwalletJSSVG,
}

function ExtensionChip({extension, onClick}) {
  const theme = useTheme();
  
  if (!extension) {
    return null
  }

  return (
    <Chip sx={{ width: 160, justifyContent: 'flex-start'}} 
      onClick={() => onClick(extension)}
      label={extension.title} 
      variant="outlined" color="secondary"
      avatar={<Avatar alt={extension.title} src={extensionIcon[extension.id]} />}
    />
  )
}

function AccountChip({account, onClick}) {
  const theme = useTheme();
  
  if (!account) {
    return null
  }

  return (
    <Chip sx={{ width: 160, justifyContent: 'flex-start'}} 
      onClick={() => onClick(account)}
      label={account.name} 
      variant="outlined" color="secondary"
      icon={<Identicon value={account.address} size={24} theme={'polkadot'} />} 
    />
  )
}

function CandidateChip({stash}) {
  const theme = useTheme();
  const valProfile = useSelector(state => selectValProfileByAddress(state, stash));

  return (
    <Chip sx={{ minWidth: 160, justifyContent: 'flex-start'}}
      label={nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(stash, 4), 12)} 
      variant="outlined" color="secondary"
      icon={<Identicon value={stash} size={24} theme={'polkadot'} />} 
    />
  )
}

export default function NominationDialog({ api, open, onClose }) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const candidates = useSelector(selectCandidates);
  const { extensions } = useExtensions();
  const { extensionAccounts, connectExtensionAccounts } = useExtensionAccounts();
  const [extensionEnabled, setExtensionEnabled] = React.useState();
  const [controllerAccounts, setControllerAccounts] = React.useState([]);
  const [activeAccount, setActiveAccount] = React.useState();

  // TODO: better handle tx status 
  const [successTx, setSuccessTx] = React.useState();
  const [failedTx, setFailedTx] = React.useState();

  React.useEffect(() => {
    // TODO: fully test the flow with all extensions

    if (extensionEnabled) {

      // filter accounts specific to the selected extension
      const filteredAccounts = extensionAccounts.filter(acc => acc.source  === extensionEnabled)

      // TODO: look for proxy accounts
      // filter and set only controller accounts
      getBondedAccounts(api, filteredAccounts).then(responses => {
        const controllers = responses.filter(bonded => bonded.isSome).map(bonded => bonded.unwrap().toString())
        const accounts = filteredAccounts.filter(acc => !!controllers.find(address => address === acc.address.toString()))
        setControllerAccounts(accounts)
      })

    }

  }, [extensionEnabled, extensionAccounts]);
  
  const handleOnCancel = () => {
    setSuccessTx();
    setFailedTx();
    onClose();
  };

  const handleOnNominate = () => {
    try {
      if (activeAccount) {
        const ext = api.tx.staking.nominate(candidates)
        const {method: { method, section }} = ext
        const extDescription = `${section}.${method}`
        ext.signAndSend(activeAccount.address, { signer: activeAccount.signer }, ({status, events = []}) => {
          console.log(`Transaction status ${status.type}`)
          
          if (status.isInBlock) {
            console.log(`Transaction in block (https://${selectedChain}.subscan.io/extrinsic/${ext.hash.toString()})`)
            
            events.forEach(({ event }) => {
              const url = {
                href: `https://${selectedChain}.subscan.io/extrinsic/${ext.hash.toString()}`,
                text: hashDisplay(status.hash.toString())
              }
              if (api.events.system.ExtrinsicSuccess.is(event)) {
                console.log(`${extDescription} Success`, url);
                setSuccessTx(url);
              } else if (api.events.system.ExtrinsicFailed.is(event)) {
                // extract the data for this event
                const [dispatchError] = event.data;
                let errorInfo;

                // decode the error
                if (dispatchError.isModule) {
                  // for module errors, we have the section indexed, lookup
                  // (For specific known errors, we can also do a check against the
                  // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
                  const decoded = api.registry.findMetaError(dispatchError.asModule);

                  errorInfo = `${decoded.section}.${decoded.name}`;
                } else {
                  // Other, CannotLookup, BadOrigin, no extra info
                  errorInfo = dispatchError.toString();
                }
                setFailedTx(errorInfo);
                console.error(`${extDescription} Failed: ${errorInfo}`, url);
              }
            })
          } 
        });
      }
    } catch(e) {
      console.error(e);
    }
  }

  const handleOnClickExtension = (extension) => {
    connectExtensionAccounts(extension).then(() => setExtensionEnabled(extension.id));
  }

  const handleOnClickAccount = (account) => {
    setActiveAccount(account)
    localStorage.setItem(`${selectedChain}_account`, account.address)
  }

  const handleOnClickAccountRemove = (account) => {
    setActiveAccount()
    localStorage.removeItem(`${selectedChain}_account`)
  }

  const handleOnBack = () => {
    if (!activeAccount) {
      setExtensionEnabled()
    } else (
      setActiveAccount()
    )
  }

return (
    <StyledDialog fullWidth={true} maxWidth="xs" open={open} onClose={handleOnCancel} keepMounted>
      { !successTx && !failedTx ?
        <Box sx={{
          m: 0,
          p: 0,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <DialogTitle sx={{ color: theme.palette.text.secondary }} >Nominate Validators</DialogTitle>
          <DialogActions>
            {extensionEnabled ? 
              <Button autoFocus onClick={handleOnBack} variant='outlined' color='secondary'>
                Back
              </Button> : null}
            <Button onClick={handleOnNominate} disabled={!activeAccount} startIcon={<NominationIcon />}
              variant='contained' color='secondary' >Nominate</Button>
          </DialogActions>
        </Box> : null }
      { successTx || failedTx ? 
        <DialogContent sx={{ py: 0, m: theme.spacing(2) }}>
          { successTx ?
            <Box>
              <Typography color='secondary'>Congrats Nomination Succeeded!</Typography>
              <Typography variant='caption' color='secondary'>
                Extrinsic {`${successTx.text}`} available <Link href={successTx.href} target="_blank" rel="noreferrer" color="inherit">here</Link>.
              </Typography>
            </Box> : 
            <Box>
              <Typography color='secondary'>Nomination Failed!</Typography>
              <Typography variant='caption' color='red'>
                {failedTx}
              </Typography>
            </Box> 
          }
        </DialogContent> : 
        <DialogContent sx={{ py: 0, mb: theme.spacing(2) }}>          
          { !extensionEnabled ? 
            <List disablePadding 
                subheader={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <ListSubheader sx={{ bgcolor: 'transparent' }}>Select Extension:</ListSubheader>
                  </Box>
                }>
                {extensions.map((value, index) => {
                  return (
                    <ListItem key={index} sx={{ py: 0, mb: theme.spacing(1) }}>
                      <ExtensionChip extension={value} onClick={handleOnClickExtension} />
                    </ListItem>
                  );
                })}
              </List> : 
          
            (!activeAccount ?
              <List disablePadding 
                subheader={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <ListSubheader sx={{ bgcolor: 'transparent' }}>Select Controller Account:</ListSubheader>
                  </Box>
                }>
                {controllerAccounts.map((value, index) => {
                  return (
                    <ListItem key={index} sx={{ py: 0, mb: theme.spacing(1) }}>
                      <AccountChip account={value} onClick={handleOnClickAccount} />
                    </ListItem>
                  );
                })}
                {controllerAccounts.length === 0 ? 
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText sx={{ color: theme.palette.text.secondary }} primary="No controllers account detected." ></ListItemText>
                  </ListItem>
                  : null }
              </List> : 
              <React.Fragment>
                <List disablePadding 
                  subheader={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <ListSubheader sx={{ bgcolor: 'transparent' }}>Controller account:</ListSubheader>
                    </Box>
                  }>
                  <ListItem>
                    <AccountChip account={activeAccount} onClick={handleOnClickAccountRemove} />
                  </ListItem>
                </List>
                <List disablePadding 
                  subheader={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <ListSubheader sx={{ bgcolor: 'transparent' }}>Candidate accounts:</ListSubheader>
                    </Box>
                  }>
                  {candidates.map((value, index) => {
                    return (
                      <ListItem key={index} sx={{ py: 0, mb: theme.spacing(1) }} >
                        <CandidateChip stash={value} />
                      </ListItem>
                    );
                  })}
                </List>
              </React.Fragment>
            )}
        </DialogContent> 
      }
      {/* <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleDone} variant='contained'>Done</Button>
      </DialogActions> */}
    </StyledDialog>
  );
}
