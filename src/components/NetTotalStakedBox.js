import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  useGetSessionsQuery,
 } from '../features/api/sessionsSlice';
import {
  selectChainInfo
} from '../features/chain/chainSlice';
import { stakeDisplay } from '../util/display';

 const renderTooltip = (props, theme, chainInfo) => {
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
            <b>Total Staked</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`session #${data.session.format()}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.semantics.red }}>●</span>Total Issuance: <b>{stakeDisplay(data.total_issuance + data.total_issuance_min, chainInfo, 0, true)}</b>
          </Typography>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.grey[900] }}>●</span>Total Staked: <b>{stakeDisplay(data.total_staked + data.total_staked_min, chainInfo, 0, true)}</b> ({Math.round((data.total_staked + data.total_staked_min) / (data.total_issuance + data.total_issuance_min) * 100 )}%)
          </Typography>
        </Box>
        
        
      </Box>
    );
  }

  return null;
};

export default function NetTotalStakedBox({sessionIndex, maxSessions}) {
  const theme = useTheme();
  const chainInfo = useSelector(selectChainInfo)
  const {data, isSuccess, isFetching } = useGetSessionsQuery({from: sessionIndex - maxSessions, to: sessionIndex - 1, show_netstats: true}, {refetchOnMountOrArgChange: true});

  if (isFetching || isUndefined(data) || isUndefined(chainInfo)) {
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

  // 
  const total_staked = data.filter(s => s.six === sessionIndex - 1)
    .map(s => !isUndefined(s.netstats) ? s.netstats.total_staked : 0)[0];

  const total_issuance = data.filter(s => s.six === sessionIndex - 1)
    .map(s => !isUndefined(s.netstats) ? s.netstats.total_issuance : 0)[0];

  const total_staked_percentage = total_issuance > 0 ? Math.round(total_staked / total_issuance * 100) : undefined;

  const timelineData = data
    .filter(s => !isUndefined(s.netstats) ? s.netstats.total_staked !== 0 : false)
    .map((s, i) => ({
    session: s.six,
    total_issuance: !isUndefined(s.netstats) ? s.netstats.total_issuance : 0,
    total_staked: !isUndefined(s.netstats) ? s.netstats.total_staked : 0,
  }))

  return (
    <Paper
      sx={{
        pt: 2,
        pl: 2,
        display: 'flex',
        // justifyContent: 'space-between',
        flexDirection: 'column',
        // alignItems: 'center',
        width: '100%',
        height: 192,
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" gutterBottom>Total Staked</Typography>
          <Typography variant="h4">
            {stakeDisplay(total_staked, chainInfo, 0, true)} {!isUndefined(total_staked_percentage) ? `(${total_staked_percentage}%)` : ''}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            // width="100%"
            // height="100"
            data={timelineData}
            margin={{
              top: 5,
              right: -40,
              left: -50,
              bottom: -20,
            }}
          >
            <XAxis dataKey="session" interval={0} angle={-45} dx={20} fontSize="0.75rem" 
              tick={false}
              tickLine={false}
              axisLine={false} />
            <YAxis type="number"
              yAxisId="total_issuance_id"
              domain={['dataMin', 'dataMax']}
              tick={false}
              tickLine={false}
              axisLine={false} />
            <YAxis type="number"
              yAxisId="total_staked_id"
              orientation="right"
              domain={['dataMin', 'dataMax']}
              tick={false}
              tickLine={false}
              axisLine={false} />
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme, chainInfo)} />
            <Line yAxisId="total_issuance_id" isAnimationActive={false} type="monotone" dataKey="total_issuance" 
              strokeWidth={2} stroke={theme.palette.semantics.red} dot={false} />
            <Line yAxisId="total_staked_id" isAnimationActive={false} type="monotone" dataKey="total_staked" 
              strokeWidth={2} stroke={theme.palette.grey[900]} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}