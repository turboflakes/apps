import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import orderBy from 'lodash/orderBy'
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
import {
  addressChanged,
  selectChain
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice';
import { calculateMvr } from '../util/mvr'
import { stashDisplay, nameDisplay } from '../util/display'
import { grade } from '../util/grade';
import { chainAddress } from '../util/crypto';
import { getNetworkSS58Format } from '../constants'


const gradeValue = (v) => grade(1-calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv));

export default function ValGroupList({sessionIndex, groupId}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex, groupId));  
  const validatorsOrderedByPoints = orderBy(validators, o => o.auth.ep - o.auth.sp, "desc");  

  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged(`validator/${address}`));
    // navigate(`/one-t/${selectedChain}/validator/${address}`)
    navigate(`/validator/${address}`)
  }

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '192px'}}>
        <List dense >
          {validatorsOrderedByPoints.map((v, i) => (
            <ListItemButton key={i} sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(v.address)}
              title={nameDisplay(!!v.profile ? v.profile._identity : stashDisplay(v.address, 4), 64)}>
              <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
                <span style={{ width: '4px', height: '4px', marginLeft: '-4px', marginRight: '8px', borderRadius: '50%', 
                  backgroundColor: theme.palette.grade[gradeValue(v)], 
                  display: "inline-block" }}></span>
                <Identicon
                  value={v.address}
                  size={24}
                  theme={'polkadot'} />
              </ListItemIcon>
              <ListItemText sx={{whiteSpace: "nowrap"}}
                primary={nameDisplay(v.profile?.identity ? v.profile._identity : stashDisplay(chainAddress(v.address, getNetworkSS58Format(selectedChain)), 4), 12)}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
  );
}