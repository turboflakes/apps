import * as React from 'react';
// import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import NetValChartLegend from './NetValChartLegend';

import { 
  useGetSessionsQuery,
 } from '../features/api/sessionsSlice'

 const renderTooltip = (props, theme) => {
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
            <b>Active Validators</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`session #${data.session.format()}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.semantics.blue }}>●</span>TVP: <b>{data.tvp}</b> ({Math.round((data.tvp * 100 ) / data.total)}%)
          </Typography>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.grey[900] }}>●</span>100% Com.: <b>{data.c100}</b> ({Math.round((data.c100 * 100 ) / data.total)}%)
          </Typography>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>●</span>Others: <b>{data.others}</b> ({Math.round((data.others * 100 ) / data.total)}%)
          </Typography>  
        </Box>
        
        
      </Box>
    );
  }

  return null;
};

export default function NetActiveValidatorsBox({sessionIndex, maxSessions}) {
  const theme = useTheme();
  const {data, isSuccess, isFetching} = useGetSessionsQuery({from: sessionIndex - maxSessions, to: sessionIndex - 1, show_netstats: true});

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

  // 
  const mainValue = data.filter(s => s.six === sessionIndex - 1)
    .map(s => !isUndefined(s.netstats) ? s.netstats.subsets.map(m => m.vals_active).reduce((a, b) => a + b, 0) : 0)[0];

  const timelineData = data.map((s, i) => ({
    session: s.six,
    total: !isUndefined(s.netstats) ? s.netstats.subsets.map(m => m.vals_active).reduce((a, b) => a + b, 0) : 0,
    c100: !isUndefined(s.netstats) ? s.netstats.subsets.filter(f => f.subset === "C100")[0].vals_active : 0,
    tvp: !isUndefined(s.netstats) ? s.netstats.subsets.filter(f => f.subset === "TVP")[0].vals_active : 0,
    others: !isUndefined(s.netstats) ? s.netstats.subsets.filter(f => f.subset === "NONTVP")[0].vals_active : 0,
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
        height: '100%',
        borderRadius: 3,
        // borderTopLeftRadius: '24px',
        // borderTopRightRadius: '24px',
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption" gutterBottom>Active Validators</Typography>
          <Typography variant="h4">
            {mainValue}
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
              top: 8,
              right: 32,
              left: -24,
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
              domain={['dataMin', 'dataMax']}
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} 
              tickLine={{stroke: '#C8C9CC', strokeWidth: 1}}
              />
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
            <Line isAnimationActive={false} type="monotone" dataKey="c100" 
              strokeWidth={2} stroke={theme.palette.grey[900]} dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="others" 
              strokeWidth={2} stroke={theme.palette.grey[200]} dot={false} />
            <Line isAnimationActive={false} type="monotone" dataKey="tvp" 
              strokeWidth={2} stroke={theme.palette.semantics.blue} dot={false} />
            
            <Legend verticalAlign="top" content={() => NetValChartLegend({theme})} height={24} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}