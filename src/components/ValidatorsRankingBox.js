import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
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
import RankingPaginationBox from './RankingPaginationBox';
import {
  useGetValidatorsQuery,
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
  nameDisplay } from '../util/display'
import { isNull } from 'lodash';

const trendSign = (trend) => Math.sign(trend) > 0 ? '↑' : ( Math.sign(trend) < 0 ? '↓' : '');

function ItemButtom({address, sessionIndex, rank, diff}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const grade = useSelector(state => selectValidatorGradeBySessionAndAddress(state, sessionIndex, address));
  
  if (isUndefined(valProfile) || isUndefined(valProfile._performance_ranking)) {
    return (<Skeleton variant="text" sx={{ minWidth: 128, fontSize: '0.825rem' }} />)
  }

  const handleAddressSelected = (address) => {
    dispatch(addressChanged(address));
    dispatch(pageChanged(`validator/${address}`));
    // navigate(`/one-t/${selectedChain}/validator/${address}`)
    navigate(`/validator/${address}`)
  }

  return (
    <Tooltip
        disableFocusListener
        placement="right"
        title={
          <Box sx={{ p: 1}}>
            <Typography variant="caption" paragraph>
              <b>{nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(address, 4), 18)}</b>
            </Typography>
            <Typography component="div" variant="caption" gutterBottom>
              <b>rank:</b> {rank}
            </Typography>
            <Typography component="div" variant="caption" paragraph>
              <b>rank change:</b> {Math.sign(diff) > 0 ? `+${Math.abs(diff)}` : `-${Math.abs(diff)}`}
            </Typography>
            <Typography component="div" variant="caption" gutterBottom>
              <b>score:</b> {valProfile._performance_ranking.score / 1000000}
            </Typography>
            <Typography component="div" variant="caption" gutterBottom>
              <b>mvr:</b> {Math.round(valProfile._performance_ranking.mvr * 1000000) / 1000000}
            </Typography>
            <Typography component="div" variant="caption" gutterBottom>
              <b>p/v points (avg):</b> {valProfile._performance_ranking.avg_para_points}
            </Typography>
            <Typography component="div" variant="caption" gutterBottom>
              <b>p/v sessions:</b> {valProfile._performance_ranking.para_epochs}
            </Typography>
          </Box>
        }
        >   
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
          primary={nameDisplay(!!valProfile ? valProfile._identity : stashDisplay(address, 4), 24)}
        />
        <ListItemText align="right" sx={{ color: Math.sign(diff) > 0 ? theme.palette.semantics.green : theme.palette.semantics.red }}
          primary={diff !== 0 ? `${trendSign(diff)} ${Math.abs(diff)}` : ''}
        />
      </ListItemButton>
    </Tooltip>
  )
}

const RANK_SIZE = 100;
const PAGE_SIZE = 16;

export default function ValidatorsRankingBox({sessionIndex, maxSessions, skip}) {
  const theme = useTheme();
  const [subset, setSubset] = React.useState("TVP");
  const [page, setPage] = React.useState(0);
  const params = {from: sessionIndex - maxSessions, to: sessionIndex - 1, ranking: "performance", size: RANK_SIZE}
  const {data, isSuccess, isFetching} = useGetValidatorsQuery(subset === "TVP" ? {...params, subset} : params, {skip});
  const paramsPrevious = {from: (sessionIndex - 1) - maxSessions, to: sessionIndex - 2, ranking: "performance", size: RANK_SIZE}
  const {data: previousData, isSuccess: isPreviousSuccess, isFetching: isPreviousFetching} = useGetValidatorsQuery(subset === "TVP" ? {...paramsPrevious, subset} : paramsPrevious, {skip});

  const handleChange = (event, newValue) => {
    if (isNull(newValue)) {
      return
    }
    setSubset(newValue)
  };

  const handlePageChange = (page) => {
    setPage(page)
  }

  let ranking = [];
  if (isSuccess && isPreviousSuccess) {
    data.data.forEach((v, i) => {
      const o = previousData.data.findIndex(p => v.address === p.address)
      if (o === -1 ) {
        ranking.push({...v, diff: RANK_SIZE - i})  
      } else {
        ranking.push({...v, diff: o - i})
      }
    })
  }

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
            Top 100 Validators Performances
          </Typography>
          <Typography variant="caption" gutterBottom>
            Performance ranking of the last {maxSessions} sessions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Tooltip
            disableFocusListener
            placement="bottom-end"
            title={
              <Box sx={{ p: 1}}>
                <Typography variant="caption" paragraph>
                <b>Top Validators Performances</b>
                </Typography>
                <Typography variant="caption" paragraph>
                  ONE-T performance ranking is based on the following criteria:
                </Typography>
                <Typography component="div" variant="caption" gutterBottom>
                  <b>score:</b> Backing votes ratio (1-MVR) make up 75% of the score, average p/v points make up 18% and number of sessions as p/v the remaining 7%
                </Typography>
                <Typography component="div" variant="caption" gutterBottom>
                  <b>sorting:</b> Validators are sorted by Score in descending order
                </Typography>
                <Typography component="div" variant="caption" paragraph>
                  <b>inclusion:</b> To be considered for the ranking, validators must have been p/v for at least 5 times in the last {maxSessions} sessions.
                </Typography>
                <i>performance_score = (1 - mvr) * 0.75 + ((avg_pts - min_avg_pts) / (max_avg_pts - min_avg_pts)) * 0.18 + (pv_sessions / total_sessions) * 0.07</i>
              </Box>
            }
            >
            <InfoOutlinedIcon sx={{ color: theme.palette.neutrals[300]}}/>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end'}}>
        <ToggleButtonGroup
          size="small"
          sx={{mx: 2}}
          value={subset}
          exclusive
          onChange={handleChange}
          aria-label="text alignment"
        >
          <ToggleButton value="all" aria-label="left aligned" 
            sx={{ minWidth: 48, mr: 1, border: 0, 
              fontSize: "0.625rem",
              '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
              '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
            All
          </ToggleButton>
          <ToggleButton value="TVP" aria-label="centered" 
            sx={{ minWidth: 48, border: 0, 
              fontSize: "0.625rem",
              '&.Mui-selected' : {borderRadius: 16, pr: 2}, 
              '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            <b>TVP</b>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ height: 592, display: 'flex', flexDirection: 'column'}}>
        {isFetching || isPreviousFetching?
          <Box sx={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Spinner size={32}/>
          </Box>
          : (isSuccess ?
            <List dense sx={{
              overflow: 'auto',
            }}>
              {ranking.slice(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE).map((v, i) => 
                (<ItemButtom key={i} address={v.address} sessionIndex={sessionIndex} rank={i + (page * PAGE_SIZE) + 1} diff={v.diff}/>))}
            </List> : null)
        }
      </Box>
      <RankingPaginationBox rankSize={RANK_SIZE} pageSize={PAGE_SIZE} onChange={handlePageChange} />
    </Paper>
  );
}