import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Spinner from './Spinner';
import PoolHistoryToggle from './PoolHistoryToggle';
import {
  useGetPoolsQuery
} from '../features/api/poolsSlice';
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

export default function PoolHistorySection({sessionIndex, poolId}) {
  const theme = useTheme();
  const [key, setKey] = React.useState("members");
  const selectedChainInfo = useSelector(selectChainInfo)
  const maxSessions = useSelector(selectMaxHistorySessions);
  
  const {data, isFetching, isSuccess} = useGetPoolsQuery({from: sessionIndex - maxSessions, to: sessionIndex - 1, pool: poolId, show_stats: true});

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

  const timelineData = data.data
    .map((s, i) => ({
    session: s.session,
    members: !isUndefined(s.stats) ? s.stats.member_counter : 0,
    reward:  !isUndefined(s.stats) ? s.stats.reward : 0,
    staked:  !isUndefined(s.stats) ? s.stats.staked : 0,
  }))

  const handleStatChanged = (newValue) => {
    setKey(newValue)
  }

  return (
    <Box sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      width: "100%",
      height: "80%"
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PoolHistoryToggle onChange={handleStatChanged} />
      </Box>
      <Box sx={{ height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={timelineData}
            margin={{
              top: 5,
              right: 32,
              left: -24,
            }}
          >
            <CartesianGrid strokeDasharray="1 4" vertical={false} horizontal={true} />

            <XAxis dataKey="session" angle={-30} fontSize="0.75rem" tickMargin={8} /> 

            <YAxis type="number"
              yAxisId="axis_id"
              dataKey={key}
              domain={['dataMin', 'dataMax']}
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1, width: 100}} 
              tickFormatter={(a) => ["reward", "staked"].includes(key) ? stakeDisplay(a, selectedChainInfo, 0, true, false) : a}
              // tickCount={5}
              // tick={false}
              // tickLine={false}
              // axisLine={false} 
              />
            <Line yAxisId="axis_id" isAnimationActive={false} type="monotone" dataKey={key} 
              strokeWidth={2} stroke={theme.palette.text.primary} dot={false} />
            
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme, key, selectedChainInfo)} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}