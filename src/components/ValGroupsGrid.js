import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupCard from './ValGroupCard';
import GradeDescription from './GradeDescription';
import { 
  selectValGroupIdsBySession
 } from '../features/api/sessionsSlice'

export default function ValGroupsGrid({sessionIndex}) {
	const groupIds = useSelector(state => selectValGroupIdsBySession(state, sessionIndex));
  
  return (
		<Box sx={{ m: 0 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4">Val. Groups</Typography>
        <Typography variant="subtitle">Attestations of Validity by Val. Groups</Typography>
        {/* <GradeDescription sessionIndex={sessionIndex} gradeValue="A+" /> */}
      </Box>
      <Grid container spacing={2}>
        {groupIds.map(groupId => (
          <Grid item xs={12} md={3} key={groupId}>
            <ValGroupCard sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}