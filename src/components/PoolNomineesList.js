import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
import {
  addressChanged
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import {
  selectNomineesBySessionAndPoolId
} from '../features/api/poolsSlice';
import { calculateMvr } from '../util/mvr'
import { stashDisplay, nameDisplay } from '../util/display'
import { grade } from '../util/grade';


const gradeValue = (v) => grade(1-calculateMvr(v.para_summary.ev, v.para_summary.iv, v.para_summary.mv));

export default function PoolNomineesList({sessionIndex, poolId}) {
  // const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectNomineesBySessionAndPoolId(state, sessionIndex, poolId));

  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged(`validator/${address}`));
    // navigate(`/one-t/${selectedChain}/validator/${address}`)
    navigate(`/validator/${address}`)
  }

  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '192px'}}>
        <List dense sx={{
          overflow: 'auto',
          height: 216,
        }}>
          {validators.map((v, i) => (
            <ListItemButton key={i} sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(v.address)}>
              <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
                <Identicon
                  value={v.address}
                  size={24}
                  theme={'polkadot'} />
              </ListItemIcon>
              <ListItemText sx={{whiteSpace: "nowrap"}}
                primary={nameDisplay(!!v.profile ? v.profile._identity : stashDisplay(v.address, 4), 12)}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
  );
}