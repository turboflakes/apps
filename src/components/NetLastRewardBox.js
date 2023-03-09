import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined';
import groupBy from 'lodash/groupBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { ComposedChart, Bar, XAxis, YAxis, Tooltip, Cell, Rectangle, ResponsiveContainer } from 'recharts';
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
            <b>Last Reward</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`era #${data.era.format()}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.semantics.green }}>●</span>Last Reward: <b>{stakeDisplay(data.last_rewarded, chainInfo, 4, true, true, true)}</b>
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
      height: 256,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }
  
  if (!isSuccess) {
    return null
  }

  
  // 
  const groupedByEra = groupBy(data, v => v.eix);
  const dataGroupedByEra = Object.keys(groupedByEra).map(k => ({eix: Number(k), value: !isUndefined(groupedByEra[k][0].netstats) ? groupedByEra[k][0].netstats.last_rewarded : 0}))
  const last_rewarded = dataGroupedByEra[dataGroupedByEra.length - 1].value;

  const timelineData = dataGroupedByEra.map((s, i) => ({
    era: s.eix,
    last_rewarded: s.value
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
        height: 256,
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" gutterBottom>Last Reward</Typography>
          <Typography variant="h4">
            {stakeDisplay(last_rewarded, chainInfo, 4, true, true, true)}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            // width="100%"
            // height="100"
            data={timelineData}
            margin={{
              top: 5,
              right: 20,
              left: -50,
              bottom: -20,
            }}
          >
            <XAxis dataKey="session" interval={0} angle={-45} dx={20} fontSize="0.75rem" 
              tick={false}
              tickLine={false}
              axisLine={false} />
            <YAxis type="number" 
              domain={['dataMin', 'dataMax']} 
              tick={false}
              tickLine={false}
              axisLine={false} />
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme, chainInfo)} />
            <Bar dataKey="last_rewarded" barSize={8} shape={<Rectangle radius={[8, 8, 0, 0]} />} >
              {
                data.map((entry, index) => (
                <Cell key={`cell-${index}`} cursor="pointer" 
                  fill={theme.palette.semantics.green} />))
              }
            </Bar>
            {/* <Line isAnimationActive={false} type="monotone" dataKey="total_issuance" 
              strokeWidth={2} stroke={theme.palette.semantics.red} dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="total_staked" 
              strokeWidth={2} stroke={theme.palette.grey[900]} dot={false} /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}