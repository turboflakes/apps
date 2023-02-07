import * as React from 'react';
import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import NetStatToggle from './NetStatToggle';

import { 
  useGetSessionsQuery,
 } from '../features/api/sessionsSlice'
import { 
  useGetBlocksQuery,
  selectBlocksBySession,
 } from '../features/api/blocksSlice'
import {
  selectIsLiveMode,
  selectMaxHistorySessions,
  selectMaxHistoryEras
} from '../features/layout/layoutSlice';

// const COLORS = (theme) => ([theme.palette.grey[900], theme.palette.grey[200], theme.palette.semantics.blue])

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
            <b>Session Points</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`session #${data.session.format()}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.semantics.blue }}>●</span>TVP: <b>{data.tvp.format()}</b> ({Math.round((data.tvp * 100 ) / data.total)}%)
          </Typography>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.grey[900] }}>●</span>100% Com.: <b>{data.c100.format()}</b> ({Math.round((data.c100 * 100 ) / data.total)}%)
          </Typography>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.grey[200] }}>●</span>Others: <b>{data.others.format()}</b> ({Math.round((data.others * 100 ) / data.total)}%)
          </Typography>  
        </Box>
        
        
      </Box>
    );
  }

  return null;
};

export default function NetPointsValidatorsBox({sessionIndex, maxSessions}) {
  const theme = useTheme();
  const {data, isSuccess, isFetching } = useGetSessionsQuery({from: sessionIndex - 12, to: sessionIndex - 1, show_netstats: true}, {refetchOnMountOrArgChange: true});
  const [key, setKey] = React.useState("vals_points_total");

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
  const mainValue = data.filter(s => s.six === sessionIndex - 1).map(s => s.netstats.subsets.map(m => m[key]).reduce((a, b) => a + b, 0))[0];

  const timelineData = data.map((s, i) => ({
    session: s.six,
    total: !isUndefined(s.netstats) ? s.netstats.subsets.map(m => m[key]).reduce((a, b) => a + b, 0) : 0,
    c100: !isUndefined(s.netstats) ? s.netstats.subsets.filter(f => f.subset === "C100")[0][key] : 0,
    tvp: !isUndefined(s.netstats) ? s.netstats.subsets.filter(f => f.subset === "TVP")[0][key] : 0,
    others: !isUndefined(s.netstats) ? s.netstats.subsets.filter(f => f.subset === "NONTVP")[0][key] : 0,
  }))

  const handleStatChanged = (newValue) => {
    setKey(`vals_points_${newValue}`)
  }

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
          <Typography variant="caption" gutterBottom>Session Points</Typography>
          <Typography variant="h3">
            {mainValue.format()}
          </Typography>
        </Box>
        <NetStatToggle onChange={handleStatChanged} />
      </Box>
      <Box sx={{ height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              // domain={['auto', 'dataMax']} 
              tick={false}
              tickLine={false}
              axisLine={false} />
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
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}