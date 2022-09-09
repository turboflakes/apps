import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import isUndefined from 'lodash/isUndefined'
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
      <Box
        sx={{
          p: 2,
          // m: 2,
          display: 'flex',
          flexDirection: 'column',
          width: '70%',
          height: 120,
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
        <Typography variant="h4">Val. Groups</Typography>
        <GradeDescription sessionIndex={sessionIndex} gradeValue="A+" />
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