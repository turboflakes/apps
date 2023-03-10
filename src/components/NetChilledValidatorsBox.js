import * as React from 'react';
// import { useSelector } from 'react-redux'
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Legend, 
  Bar, Rectangle, Cell, ResponsiveContainer } from 'recharts';

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
            <b>Chilled Validators and Disputes</b>
          </Typography>
          <Typography component="div" variant="caption" color="inherit">
            <i>{`session #${data.session.format()}`}</i>
          </Typography>
        </Box>
        <Box sx={{ minWidth: '192px'}}>
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.grey[400] }}>❚</span>Chilled: <b>{data.chilled} validators</b> ({Math.round((data.chilled * 10000 ) / data.total) / 100}%)
          </Typography>  
          <Typography component="div" variant="caption">
            <span style={{ marginRight: '8px', color: theme.palette.semantics.red }}>❚</span>Disputes: <b>{data.disputes}</b>
          </Typography>  
        </Box>
      </Box>
    );
  }

  return null;
};

function ChartLegend({theme}) {
  return (
    <Box sx={{display: 'flex', justifyContent: 'flex-end', mr: 8}}>
      <Typography variant="caption" color="inherit" sx={{mr: 1}}>
        <span style={{ marginRight: '8px', color: theme.palette.grey[400] }}>❚</span>Chilled validators
      </Typography>
      <Typography variant="caption" color="inherit" >
        <span style={{ marginRight: '8px', color: theme.palette.semantics.red }}>❚</span>Disputes
      </Typography>
    </Box>
  );
}

export default function NetChilledValidatorsBox({sessionIndex, maxSessions}) {
  const theme = useTheme();
  const {data, isSuccess, isFetching} = useGetSessionsQuery({from: sessionIndex - maxSessions, to: sessionIndex - 1, show_stats: true, show_netstats: true}, {skip: isNaN(sessionIndex)});

  if (isFetching || isUndefined(data)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: '100%',
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }
  
  if (!isSuccess) {
    return null
  }


  const timelineData = data.map((s, i) => ({
    session: s.six,
    total: !isUndefined(s.stats) ? s.stats.na : 0,
    chilled: !isUndefined(s.netstats) ? s.netstats.total_vals_chilled : 0,
    disputes: !isUndefined(s.stats) ? s.stats.di : 0,
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
          <Typography variant="caption" gutterBottom>Chilled Validators and Disputes</Typography>
          {/* <Typography variant="h4">
            {mainValue}
          </Typography> */}
        </Box>
      </Box>
      <Box sx={{ height: '100%'}}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            // width="100%"
            // height="100"
            data={timelineData}
            margin={{
              top: 8,
              right: 0,
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
            {/* show chilled */}
            <Bar dataKey="chilled" 
              barSize={8} shape={<Rectangle radius={[8, 8, 0, 0]} />} >
              {
                data.map((entry, index) => (
                <Cell key={`cell-${index}`} cursor="pointer" 
                  fill={theme.palette.grey[400]} />))
              }
            </Bar>
            {/* show disputes */}
            <YAxis type="number" yAxisId="rightDisputes"
              orientation="right"
              // domain={['dataMin', 'dataMax']}
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}
              axisLine={{stroke: '#C8C9CC', strokeWidth: 1}} 
              tickLine={{stroke: '#C8C9CC', strokeWidth: 1}}
              />
            <Bar dataKey="disputes" yAxisId="rightDisputes"
              barSize={8} shape={<Rectangle radius={[8, 8, 0, 0]} />} >
              {
                data.map((entry, index) => (
                <Cell key={`cell-${index}`} cursor="pointer" 
                  fill={theme.palette.semantics.red} />))
              }
            </Bar>
            
            <Tooltip 
                cursor={{fill: theme.palette.divider}}
                offset={24}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
            <Legend verticalAlign="top" content={() => ChartLegend({theme})} height={24} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant='caption' align='right' sx={{mb: 1, mr: 3, color: theme.palette.grey[400]}}>
        {!isUndefined(data[data.length-1].netstats) ? `latest data collected at block #${data[data.length-1].netstats.block_number}` : ""}
      </Typography>
    </Paper>
  );
}