import * as React from 'react';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { 
  useGetValidatorsQuery,
 } from '../features/api/validatorsSlice';
import {
  selectValGroupCoreAssignmentsBySessionAndGroupId
} from '../features/api/valGroupsSlice'

export default function ValGroupCoreAssignmentBox({groupId, sessionIndex}) {
  // const theme = useTheme();
  const {isFetching} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority", show_summary: true});
  const coreAssignments = useSelector(state => selectValGroupCoreAssignmentsBySessionAndGroupId(state, sessionIndex,  groupId));
  
  if (isFetching) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 96,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: 'white'
    }} />)
  }
  
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
        <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>core assignments</Typography>
        <Typography variant="h4">
          {coreAssignments}
        </Typography>
      </Box>
    </Paper>
  );
}