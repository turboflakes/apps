import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import {
  selectValGroupCoreAssignmentsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
import {
  selectChain,
} from '../features/chain/chainSlice';
import {
  getCoreAssignmentsTarget
} from '../constants'

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
          minWidth: '198px',
          boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px'
         }}
      >
        <Typography component="div" variant="caption" color="inherit" paragraph>
        <b>Core Assignments</b>
        </Typography>
        <Typography component="div" variant="caption" color="inherit">
          <span style={{ marginRight: '8px', color: data.payload.name === 'Done' ? `${theme.palette.text.primary}` : `${theme.palette.neutrals[200]}`}}>●</span>{data.payload.name}: <b>{data.payload.value} ({data.payload.percentage}%)</b>
        </Typography>
      </Box>
    );
  }

  return null;
};

export default function ValGroupCoreAssignmentBox({groupId, sessionIndex}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const coreAssignments = useSelector(state => selectValGroupCoreAssignmentsBySessionAndGroupId(state, sessionIndex,  groupId));
  const caTarget = getCoreAssignmentsTarget(selectedChain);
  
  const data = [
    {name: 'Done', value: coreAssignments, percentage: Math.round((coreAssignments * 100)/caTarget)},
    {name: 'Progress', value: caTarget - coreAssignments, percentage: Math.round(((caTarget - coreAssignments) * 100)/caTarget)}
  ];
  
  return (
    <Paper sx={{
        p: 2,
        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 96,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}>
      <Box sx={{ pl: 1, pr: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Core Assignments</Typography>
        <Typography variant="h4">
          {coreAssignments}
        </Typography>
      </Box>
      <ResponsiveContainer width='40%' height='100%' sx={{display: 'flex', alignItems:'right'}}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={24}
            innerRadius={0}
            startAngle={90}
            endAngle={-360}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? `${theme.palette.text.primary}` : `${theme.palette.grey[200]}`} />
            ))}
          </Pie>
          <Tooltip 
                cursor={{fill: 'transparent'}}
                wrapperStyle={{ zIndex: 100 }} 
                content={props => renderTooltip(props, theme)} />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
}