import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import {
	web3Enable,
  web3Accounts,
  web3FromSource,
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
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
import Chip from '@mui/material/Chip';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { ReactComponent as NominationIcon } from '../../assets/polkadot_icons/nominating_dark.svg';
import { getNetworkExternalWSS } from '../../constants';
import {
  selectValProfileByAddress,
} from '../../features/api/valProfilesSlice';
import {
  selectCandidates
} from '../../features/api/boardsSlice';
import {
  selectChain,
} from '../../features/chain/chainSlice';
import { addressSS58 } from '../../util/crypto'
import { stashDisplay, nameDisplay, hashDisplay } from '../../util/display'

const optionsDescription = ["Active Validators", "TVP Validators", "Over Subscribed", "Missing Identity"];

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


function AccountChip({key, account, onClick, onDelete}) {
  const theme = useTheme();
  
  if (!account) {
    return null
  }

  if (onDelete) {
    return (
      <Chip key={key} sx={{ width: 160, justifyContent: 'flex-start'}} 
        onDelete={() => onDelete(account)}
        label={account.meta.name} 
        variant="outlined" color="secondary"
        icon={<Identicon value={account.address} size={24} theme={'polkadot'} />} 
      />
    )
  }

  return (
    <Chip key={key} sx={{ width: 160, justifyContent: 'flex-start'}} 
      onClick={() => onClick(account)}
      label={account.meta.name} 
      variant="outlined" color="secondary"
      icon={<Identicon value={account.address} size={24} theme={'polkadot'} />} 
    />
  )
}

function CandidateChip({key, stash}) {
  const theme = useTheme();
  const valProfile = useSelector(state => selectValProfileByAddress(state, stash));

  return (
    <Chip key={key} sx={{ minWidth: 160, justifyContent: 'flex-start'}}
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
  const [options, setOptions] = React.useState();
  const [extensionEnabled, setExtensionEnabled] = React.useState(false);
  const [controllerAccounts, setControllerAccounts] = React.useState([]);
  const [account, setAccount] = React.useState(localStorage.getItem(`${selectedChain}_account`));

  React.useEffect(() => {
    // Polkadot{.js} extension
		web3Enable('apps.turboflakes.io').then(extensions => {
      // console.log("__web3Enable", extensions);
      if (extensions.length === 0) {
        // no extension installed, or the user did not accept the authorization
        // in this case we should inform the use and give a link to the extension
        return;
      } 

      setExtensionEnabled(true)

      // Check if account is available at localstorage
      if (!account) {
        
        // Retrieve all accounts
        web3Accounts().then(all => {
          // filter accounts specific to the selected network
          const filteredAccounts = all.filter(acc => {
            return acc.meta.genesisHash === api.genesisHash.toString() || !acc.meta.genesisHash
          });

          getBondedAccounts(api, filteredAccounts).then(responses => {
            const controllers = responses.filter(bonded => bonded.isSome).map(bonded => addressSS58(bonded.unwrap()))
            const accounts = filteredAccounts.filter(acc => !!controllers.find(address => address === acc.address.toString()))
            setControllerAccounts(accounts)
          })

        }); 
      } else {
        const address = localStorage.getItem(`${selectedChain}_account`)
        web3Accounts().then(all => {
          const acc = all.find(acc => {
            return acc.address === address
          });
          setAccount(acc)
          localStorage.setItem(`${selectedChain}_account`, account.address)
        })
      }			
    });

  }, [selectedChain]);
  
  const handleOnCancel = () => {
    onClose();
  };

  const handleOnNominate = () => {
    // https://polkadot.js.org/docs/api/cookbook/blocks

    web3FromSource(account.meta.source).then(injector => {
      const ext = api.tx.staking.nominate(candidates)
      const {method: { method, section }} = ext
      const extDescription = `${section}.${method}`
      ext.signAndSend(account.address, { signer: injector.signer }, ({status, events = []}) => {
        console.log(`Transaction status ${status.type}`)
        
        if (status.isInBlock) {
          console.log(`Transaction in block (https://${selectedChain}.subscan.io/extrinsic/${ext.hash.toString()})`)
          
          events.forEach(({ event }) => {
            const url = {
              href: `https://${selectedChain}.subscan.io/extrinsic/${ext.hash.toString()}`,
              text: hashDisplay(status.hash.toString())
            }
            if (api.events.system.ExtrinsicSuccess.is(event)) {
              this.props.success(`${extDescription} Success`, url)
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
              this.props.error(`${extDescription} Failed: ${errorInfo}`, url)
            }
          })
        } 
      })
      .catch(error => {
        return this.props.error(`${error}`)
      });
    })
  }

  const handleOnClickAccount = (account) => {
    setAccount(account)
    localStorage.setItem(`${selectedChain}_account`, account.address)
  }

  const handleOnClickAccountRemove = (account) => {
    setAccount()
    localStorage.removeItem(`${selectedChain}_account`)
  }

  return (
      <StyledDialog fullWidth={true} maxWidth="xs" open={open} onClose={handleOnCancel} keepMounted>
        <Box sx={{
          m: 0,
          p: 0,
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <DialogTitle sx={{ color: theme.palette.text.secondary }} >Nominate Validators</DialogTitle>
          <DialogActions>
            {/* <Button autoFocus onClick={handleOnCancel} variant='outlined' color='secondary'>
              Cancel
            </Button> */}
            <Button onClick={handleOnNominate} disabled={!account} startIcon={<NominationIcon />}
              variant='contained' color='secondary' >Nominate</Button>
          </DialogActions>
        </Box>
        <DialogContent sx={{ py: 0, mb: theme.spacing(2) }}>
          { !account ?
            <List disablePadding 
              subheader={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <ListSubheader sx={{ bgcolor: 'transparent' }}>Select Account:</ListSubheader>
                </Box>
              }>
              {controllerAccounts.map((value, index) => {
                return (
                  <ListItem key={index} sx={{ py: 0, mb: theme.spacing(1) }}>
                    <AccountChip key={index} account={value} onClick={handleOnClickAccount} />
                  </ListItem>
                );
              })}
            </List> : 
            <React.Fragment>
              <List disablePadding 
                subheader={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <ListSubheader sx={{ bgcolor: 'transparent' }}>Controller account:</ListSubheader>
                  </Box>
                }>
                <ListItem >
                  <AccountChip account={account} onClick={handleOnClickAccountRemove} />
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
                      <CandidateChip key={index} stash={value} />
                    </ListItem>
                  );
                })}
              </List>
            </React.Fragment>
            }
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleDone} variant='contained'>Done</Button>
        </DialogActions> */}
      </StyledDialog>
  );
}
