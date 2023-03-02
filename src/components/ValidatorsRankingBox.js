import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/PlaylistAdd';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
import Skeleton from '@mui/material/Skeleton';
import Spinner from './Spinner';
import SessionSliderRange from './SessionSliderRange';
import { 
  useGetSessionsQuery, 
  sessionHistoryIdsChanged,
  selectSessionHistoryIds,
  buildSessionIdsArrayHelper
} from '../features/api/sessionsSlice'
import {
  useGetValidatorsQuery,
  selectValidatorGradeBySessionAndAddress
} from '../features/api/validatorsSlice'
import {
  addressChanged
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import {
  selectValProfileByAddress, 
  useGetValidatorProfileByAddressQuery,
} from '../features/api/valProfilesSlice';

import { stashDisplay, nameDisplay } from '../util/display'
import { grade } from '../util/grade';

function ItemButtom({address, sessionIndex}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const grade = useSelector(state => selectValidatorGradeBySessionAndAddress(state, sessionIndex, address));
  
  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged(`validator/${address}`));
    // navigate(`/one-t/${selectedChain}/validator/${address}`)
    navigate(`/validator/${address}`)
  }

  return (
    <ListItemButton sx={{ borderRadius: 30}} disableRipple onClick={() => handleAddressSelected(address)}>
      <ListItemIcon sx={{minWidth: 0, mr: 1, display: 'flex', alignItems: 'center'}}>
        <span style={{ width: '4px', height: '4px', marginLeft: '-4px', marginRight: '8px', borderRadius: '50%', 
          backgroundColor: theme.palette.grade[grade], 
          display: "inline-block" }}></span>
        <Identicon
          value={address}
          size={24}
          theme={'polkadot'} />
      </ListItemIcon>
      <ListItemText sx={{whiteSpace: "nowrap"}}
        primary={nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(address, 4), 32)}
      />
    </ListItemButton>
  )
}

export default function ValidatorsRankingBox({sessionIndex, maxSessions, skip}) {
  // const theme = useTheme();
  const {data, isSuccess, isFetching} = useGetValidatorsQuery({from: sessionIndex - maxSessions, to: sessionIndex - 1, ranking: "performance", size: 16, subset: "TVP"}, {skip});
  
  if (isFetching || isUndefined(data)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 192,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }
  
  if (!isSuccess) {
    return null
  }

  const stashes = data.data.map(v => v.address);

  return (
    <Paper
      sx={{
        p: 2,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        // height: 192,
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" gutterBottom>
          Performance Ranking
          </Typography>
          <Typography variant="h5">
            Top 16
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        <List dense sx={{
          overflow: 'auto',
          // height: 216,
        }}>
          {stashes.map((v, i) => (<ItemButtom key={i} address={v} sessionIndex={sessionIndex} />))}
        </List>
      </Box>
    </Paper>
  );
  // return (
  //   <Box
  //     sx={{
  //       p: 2,
  //       // m: 2,
  //       display: 'flex',
  //       flexDirection: 'column',
  //       width: '100%',
  //     }}
  //     >
  //     <Box sx={{ my: 1, display: "flex", alignItems: "center", justifyContent: 'space-between'}} >
  //       <SessionSliderRange isFetching={isFetching} />
  //       <Box sx={{ mx: 1 }}>
  //         <Button variant='contained' 
  //           endIcon={isFetching ? <Spinner size={24}/> : <AddIcon />} 
  //           sx={{minWidth: 128, mt: -3}}
  //           onClick={handleLoadTimeline}
  //           disabled={isFetching} disableRipple>
  //           Load
  //         </Button>
  //       </Box>
  //     </Box>
  //   </Box>
  // );
}