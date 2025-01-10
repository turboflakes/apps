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
  selectActiveNomineesBySessionAndPoolId
} from '../features/api/poolsSlice';
import { calculateMVR, calculateBUR } from '../util/math'
import { stashDisplay, nameDisplay } from '../util/display'
import { gradeByRatios } from '../util/grade';
import {
  chainAddress
} from '../util/crypto';


const gradeValue = (v) => !isUndefined(v.para_summary) && !isUndefined(v.para) ? gradeByRatios(calculateMVR(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv), calculateBUR(v.para.bitfields?.ba, v.para.bitfields?.bu)) : "-";


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

  if (isUndefined(validator) || isUndefined(validator.profile)) {
    return (<Skeleton variant="text" sx={{ width: 96, height: "12px"}} />)
  }

  return (
    <ListItemButton sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(validator.address)}
      title={nameDisplay(!!validator.profile ? validator.profile._identity : stashDisplay(validator.address, 4), 64)}>
      <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
        <span style={{ width: '4px', height: '4px', marginLeft: '-4px', marginRight: '8px', borderRadius: '50%', 
          backgroundColor: theme.palette.grade[gradeValue(validator)], 
          display: "inline-block" }}></span>
        <Identicon
          value={chainAddress(validator.address, chainInfo.ss58Format)}
          size={24}
          theme={'polkadot'} />
      </ListItemIcon>
      <ListItemText sx={{whiteSpace: "nowrap"}}
        primary={nameDisplay(!!validator.profile ? validator.profile._identity : stashDisplay(validator.address, 4), 12)}
      />
    </ListItemButton>
  )
}

export default function PoolNomineesList({sessionIndex, poolId}) {
  const validators = useSelector(state => selectActiveNomineesBySessionAndPoolId(state, sessionIndex, poolId));  
  
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '192px'}}>
        <List dense sx={{
          overflow: 'auto',
          height: 192,
        }}>
          {validators.map((v, i) => (<ItemButtom key={i} validator={v}/>))}
        </List>
      </Box>
  );
}