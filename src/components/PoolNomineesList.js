import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';
import Identicon from '@polkadot/react-identicon';
import {
  addressChanged,
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import {
  selectNomineesBySessionAndPoolId
} from '../features/api/poolsSlice';
import { stashDisplay, nameDisplay } from '../util/display'
import {
  chainAddress
} from '../util/crypto';

const COLORS = (theme) => ({
  "NONVAL": theme.palette.semantics.red,
  "Non-validator": theme.palette.semantics.red,
  "C100": theme.palette.grey[900],
  "NONTVP": theme.palette.grey[200],
  "Others": theme.palette.grey[200],
  "TVP": theme.palette.semantics.blue
})

function ItemButtom({validator}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chainInfo = useSelector(selectChainInfo)

  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged(`validator/${address}`));
    // navigate(`/one-t/${selectedChain}/validator/${address}`)
    navigate(`/validator/${address}`)
  }

  if (isUndefined(validator)) {
    return (<Skeleton variant="text" sx={{ width: 96, height: "12px"}} />)
  }

  const subset = isUndefined(validator.profile) ? "NONVAL" : validator.profile.subset;

  return (
    <ListItemButton sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(validator.address)}
      title={nameDisplay(!!validator.profile ? validator.profile._identity : stashDisplay(validator.address, 4), 64)}>
      <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
        <Identicon
          value={chainAddress(validator.address, chainInfo.ss58Format)}
          size={24}
          theme={'polkadot'} />
      </ListItemIcon>
      <ListItemText sx={{whiteSpace: "nowrap", textDecoration: isUndefined(validator.profile) ? "line-through" : "none"}}
        primary={nameDisplay(!!validator.profile ? validator.profile._identity : stashDisplay(validator.address, 4), 12)}
      />
      <span style={{ width: '8px', height: '8px', marginLeft: '4px', marginRight: '-4px', borderRadius: '50%', 
          backgroundColor: COLORS(theme)[subset], 
          display: "inline-block" }}></span>
    </ListItemButton>
  )
}

export default function PoolNomineesList({sessionIndex, poolId}) {
  // const theme = useTheme();
  // const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectNomineesBySessionAndPoolId(state, sessionIndex, poolId));

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '192px'}}>
        <List dense sx={{
          overflow: 'auto',
          height: 216,
        }}>
          {validators.map((v, i) => (<ItemButtom key={i} validator={v}/>))}
        </List>
      </Box>
  );
}