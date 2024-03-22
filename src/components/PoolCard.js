import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faWaterLadder, faChartPie, faListUl } from '@fortawesome/free-solid-svg-icons'
import Tooltip from './Tooltip';
import SubsetPieChart from './SubsetPieChart';
import PoolNomineesList from './PoolNomineesList';
import PoolActiveNomineesList from './PoolActiveNomineesList';
import PoolHistorySection from './PoolHistorySection';
import {
  selectChain,
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  SUBSET
} from '../features/api/validatorsSlice';
import {
  selectPoolById,
} from '../features/api/poolsMetadataSlice';
import {
  selectNomineesBySessionAndPoolId
} from '../features/api/poolsSlice';
import { 
  stakeDisplay,
  symbolDisplay
} from '../util/display';
import { getNetworkName } from '../constants'

export default function PoolCard({sessionIndex, poolId}) {
  const theme = useTheme();
  const [showPie, setShowPie] = React.useState(true);
  const [showInsights, setShowInsights] = React.useState(false);
  const selectedChain = useSelector(selectChain);
  const selectedChainInfo = useSelector(selectChainInfo);
  const pool = useSelector(state => selectPoolById(state, poolId));
  const members = !isUndefined(pool.stats) ? pool.stats.member_counter : 0;
  const points = !isUndefined(pool.stats) ? pool.stats.points : 0;
  const rewards = !isUndefined(pool.stats) ? pool.stats.reward : 0;
  const apr = !isUndefined(pool.nomstats) ? pool.nomstats.apr : 0;
  const nActive = !isUndefined(pool.nomstats) ? pool.nomstats.active : 0;
  const nAll = !isUndefined(pool.nomstats) ? pool.nomstats.nominees : 0;
  // const active = useSelector(state => selectActiveNomineesBySessionAndPoolId(state, sessionIndex, poolId));
  const nominees = useSelector(state => selectNomineesBySessionAndPoolId(state, sessionIndex, poolId));

  
  if (isUndefined(selectedChainInfo)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 408,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }

  const groupedBySubset = groupBy(nominees, v => !isUndefined(v.profile) ? v.profile.subset : "NONVAL");
  const subsetPieData = orderBy(Object.keys(groupedBySubset).map(subset => ({ subset: SUBSET[subset], value: groupedBySubset[subset].length })), 'subset');

  const handlePie = () => {
    setShowPie(!showPie);
  }

  const handleInsights = () => {
    setShowInsights(!showInsights);
  }

  return (
    <Paper sx={{ 
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      height: 408,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{ height: '72px', p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ mb:1 }}>
          <Tooltip title={pool.metadata}>
            <Typography variant="h6" sx={{
              maxWidth: 352,
              overflow: "hidden", 
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}><span style={{marginRight: '8px'}}>#{poolId}</span>{pool.metadata}</Typography>
          </Tooltip>
          <Typography variant="subtitle2">members: {members}</Typography>
        </Box>
        <Box>
          <IconButton sx={{ }} aria-label="grade-details" onClick={handleInsights}>
            { !showInsights ? 
              <FontAwesomeIcon icon={faChartLine} fontSize="small" /> : 
              <FontAwesomeIcon icon={faWaterLadder} fontSize="small" /> }
          </IconButton>
        </Box>
      </Box>
      <Divider sx={{ 
        opacity: 0.25,
        height: '1px',
        borderTop: '0px solid rgba(0, 0, 0, 0.08)',
        borderBottom: 'none',
        backgroundColor: 'transparent',
        backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
        }} />
      {showInsights ? <PoolHistorySection sessionIndex={sessionIndex} poolId={poolId} /> :
        <Box>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between'}}>
            <Box sx={{ width: "50%", height: 224, position: 'relative', display: 'flex', flexDirection: 'column'}}>
              <Typography variant="caption" align="left" sx={{ml: 3}}>nominees: {nAll}</Typography>
              <IconButton sx={{ position: 'absolute', top: -8, right: 0, zIndex: 2}} aria-label="grade-details" onClick={handlePie}>
                { !showPie ? 
                  <FontAwesomeIcon icon={faChartPie} fontSize="small" /> : 
                  <FontAwesomeIcon icon={faListUl} fontSize="small" /> }
              </IconButton>
              { showPie ? 
                <SubsetPieChart data={subsetPieData} size="sm" showLabel /> :
                <PoolNomineesList sessionIndex={sessionIndex} poolId={poolId} />}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column'}}>
              <Typography variant="caption" align="left" sx={{ml: 3}}>active: {nActive}</Typography>  
              <PoolActiveNomineesList sessionIndex={sessionIndex} poolId={poolId} />
            </Box>
          </Box> 
          <Divider sx={{ 
            opacity: 0.25,
            height: '1px',
            borderTop: '0px solid rgba(0, 0, 0, 0.08)',
            borderBottom: 'none',
            backgroundColor: 'transparent',
            backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
            }} />
          <Box sx={{ py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography variant="caption" align='center'>pending rewards</Typography>
              <Typography variant="h5" align='center'>{stakeDisplay(rewards, selectedChainInfo, 4, true, true, true, {...theme.typography.h6})}</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography variant="caption" align='center'>points</Typography>
              <Typography variant="h5" align='center'>{stakeDisplay(points, selectedChainInfo, 2, true, false)}</Typography>
            </Box>
            {/* <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              <Typography variant="caption" align='center'>
                <b>APR</b>
                <span>
                  <Tooltip title={`Annual percentage rate (APR) is the rate used to help you understand potential returns from your bonded stake. The Nomination Pool APR is based on the average APR of all the current pool nominees (validators) from the last 84 eras on ${getNetworkName(selectedChain)}, minus the respective validators commission.`}>
                    <InfoOutlinedIcon fontSize="inherit" sx={{ml: 1}}/>
                  </Tooltip>
                </span>
              </Typography>
              <Typography variant="h5" align='center'>{`${Math.round(apr * 10000) / 100}%`}</Typography>
            </Box> */}
          </Box>
        </Box>
        }
    </Paper>
  );
}