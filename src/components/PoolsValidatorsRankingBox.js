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
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Identicon from '@polkadot/react-identicon';
import Skeleton from '@mui/material/Skeleton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from './Tooltip';
import Spinner from './Spinner';
import {
  useGetValidatorsQuery,
  selectValidatorPoolCounterBySessionAndAddress,
  selectValidatorGradeBySessionAndAddress,
} from '../features/api/validatorsSlice'
import {
  addressChanged
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import {
  selectValProfileByAddress, 
} from '../features/api/valProfilesSlice';

import { 
  stashDisplay, 
  nameDisplay,
  commissionDisplay } from '../util/display'

function ItemButtom({address, sessionIndex}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const counter = useSelector(state => selectValidatorPoolCounterBySessionAndAddress(state, sessionIndex, address));
  const grade = useSelector(state => selectValidatorGradeBySessionAndAddress(state, sessionIndex, address));
  
  if (isUndefined(valProfile) || isUndefined(counter)) {
    return (<Skeleton variant="text" sx={{ minWidth: 128, fontSize: '0.825rem' }} />)
  }

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
      // primaryTypographyProps={{ style: {fontWeight: 600}}}
        primary={nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(address, 4), 24)}
      />
      <ListItemText align="right" 
        primary={`${counter}x`}
      />
    </ListItemButton>
  )
}

export default function PoolsValidatorsRankingBox({sessionIndex, maxSessions, skip}) {
  const theme = useTheme();
  const [subset, setSubset] = React.useState("TVP");
  const params = {ranking: "pools", size: 8, show_profile: true}
  const {data, isSuccess, isFetching} = useGetValidatorsQuery(params, {skip});
  
  // if (isFetching || isUndefined(data)) {
  //   return (<Skeleton variant="rounded" sx={{
  //     width: '100%',
  //     height: 192,
  //     borderRadius: 3,
  //     boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
  //     bgcolor: 'white'
  //   }} />)
  // }
  
  // if (!isSuccess) {
  //   return null
  // }

  const handleChange = (event, newValue) => {
    setSubset(newValue)
  };

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
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
          <Typography variant="h6">
            Top Validators in Nomination Pools
          </Typography>
          <Typography variant="caption">
            The most frequently chosen
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Tooltip
            disableFocusListener
            placement="bottom-end"
            title={
              <Box sx={{ p: 1}}>
                <Typography variant="caption" paragraph>
                  <b>Top Validators in Nomination Pools</b>
                </Typography>
                <Typography component="div" variant="caption" paragraph>
                  Validators that are the most frequently picked by pool operators as nominees
                </Typography>
                <Typography component="div" variant="caption" gutterBottom>
                  <b>sorting:</b> Validators are sorted by pool counter in descending order
                </Typography>
              </Box>
            }
            >
            <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column'}}>
        {isFetching ?
          <Box sx={{height: 590, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spinner size={32}/>
          </Box>
          : (isSuccess ?
            <List dense sx={{
              overflow: 'auto',
            }}>
              {data.data.map((v, i) => (<ItemButtom key={i} address={v.address} sessionIndex={sessionIndex} />))}
            </List> : null)
        }
      </Box>
    </Paper>
  );
}