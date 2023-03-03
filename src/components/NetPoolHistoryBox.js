import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Spinner from './Spinner';
import PoolHistoryToggle from './PoolHistoryToggle';
import {
  useGetPoolsQuery
} from '../features/api/poolsSlice';
import {
  selectPoolMembersBySessions,
  selectPoolStakedBySessions,
  selectPoolRewardBySessions,
  buildSessionIdsArrayHelper
} from '../features/api/sessionsSlice';
import { 
  selectMaxHistorySessions,
} from '../features/layout/layoutSlice'
import {
  selectChainInfo
} from '../features/chain/chainSlice';
import { stakeDisplay } from '../util/display';

const LABEL = {
  "members": "Members",
  "staked": "Staked",
  "reward": "Pending Rewards",
}

const renderTooltip = (props, theme, selectedKey, selectedChainInfo) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <Box
        sx={{ 
          bgcolor: '#fff',
          p: 2,
          m: 0,
          borderRadius: 1,
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Box sx={{mb: 2}}>
          <Typography component="div" variant="caption" color="inherit">
            <b>Timeline</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`session #${data.session.format()}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.text.primary }}>●</span>{LABEL[selectedKey]}: <b>{["reward", "staked"].includes(selectedKey) ? stakeDisplay(data[selectedKey], selectedChainInfo, 2, true, true) : data[selectedKey]}</b>
          </Typography>
        </Box>
      </Box>
    );
  }

  return null;
};

export default function NetPoolHistoryBox({sessionIndex, skip}) {
  const theme = useTheme();
  const [key, setKey] = React.useState("members");
  const selectedChainInfo = useSelector(selectChainInfo)
  const maxSessions = useSelector(selectMaxHistorySessions);
  
  const {isFetching, isSuccess} = useGetPoolsQuery({from: sessionIndex - maxSessions, to: sessionIndex - 1, show_stats: true}, {skip});
  
  const historySessionIds = buildSessionIdsArrayHelper(sessionIndex - 1 , maxSessions);
  const poolMembers = useSelector((state) => selectPoolMembersBySessions(state, historySessionIds));
  const poolStaked = useSelector((state) => selectPoolStakedBySessions(state, historySessionIds));
  const poolRewards = useSelector((state) => selectPoolRewardBySessions(state, historySessionIds));
  
  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
        <Spinner size={32}/>
      </Box>
    )
  }

  if (!isSuccess) {
    return null
  }

  const timelineData = historySessionIds
    .map((s, i) => ({
    session: s,
    members: poolMembers[i],
    reward:  poolRewards[i],
    staked:  poolStaked[i],
  }))

  const handleStatChanged = (newValue) => {
    setKey(newValue)
  }

  return (
    <Paper sx={{
      pt: 2,
      pl: 2,
      display: 'flex',
      // justifyContent: 'space-between',
      flexDirection: 'column',
      // alignItems: 'center',
      width: '100%',
      height: 384,
      borderRadius: 3,
      // borderTopLeftRadius: '24px',
      // borderTopRightRadius: '24px',
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PoolHistoryToggle onChange={handleStatChanged} />
      </Box>
      <Box sx={{ height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timelineData}
            margin={{
              top: 8,
              right: 32,
              left: -8,
              bottom: 16,
            }}
          >
            <CartesianGrid strokeDasharray="1 4" vertical={false} horizontal={true} />

            <XAxis dataKey="session" angle={-30} tickMargin={8}
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} 
              tickLine={{stroke: '#C8C9CC', strokeWidth: 1}} 
              />

            <YAxis type="number"
              yAxisId="axis_id"
              dataKey={key}
              domain={['dataMin', 'dataMax']}
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} 
              tickLine={{stroke: '#C8C9CC', strokeWidth: 1}}
              tickFormatter={(a) => ["reward", "staked"].includes(key) ? stakeDisplay(a, selectedChainInfo, 0, true, false) : a}
              // tickCount={5}
              // tick={false}
              // tickLine={false}
              // axisLine={false} 
              />
            {/* <Line yAxisId="axis_id" isAnimationActive={false} type="monotone" dataKey={key} 
              strokeWidth={2} stroke={theme.palette.text.primary} dot={false} /> */}
            <Area yAxisId="axis_id" type="monotone" dataKey={key} 
              strokeWidth={2} stroke={theme.palette.text.primary} fill={theme.palette.grey[200]} />
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme, key, selectedChainInfo)} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}