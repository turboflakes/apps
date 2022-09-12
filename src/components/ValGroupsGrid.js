import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupCard from './ValGroupCard';
import GradeDescription from './GradeDescription';
import GradesBox from './GradesBox';
import { 
  selectValGroupIdsBySession
 } from '../features/api/sessionsSlice'

export default function ValGroupsGrid({sessionIndex}) {
	const groupIds = useSelector(state => selectValGroupIdsBySession(state, sessionIndex));
  
  return (
		<Box sx={{ m: 0 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4">Val. Groups</Typography>
            <Typography variant="subtitle2">Attestations of Validity by Val. Groups</Typography>
            <GradeDescription sessionIndex={sessionIndex} gradeValue="A+" />
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ mt: 2 }}>
            <GradesBox sessionIndex={sessionIndex} />
          </Box>
        </Grid>
        {groupIds.map(groupId => (
          <Grid item xs={12} md={3} key={groupId}>
            <ValGroupCard sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}