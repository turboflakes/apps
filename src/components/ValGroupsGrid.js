import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupCard from './ValGroupCard';
import { 
  selectValidatorsAll
 } from '../features/api/validatorsSlice'
import { 
  selectValGroupIdsBySession
 } from '../features/api/sessionsSlice'
import { calculateMvr } from '../util/mvr'
import { grade } from '../util/grade'

export default function ValGroupsGrid({sessionIndex}) {
	// const theme = useTheme();
  const groupIds = useSelector(state => selectValGroupIdsBySession(state, sessionIndex));
  
  // // Calculate mvr to get number of validators A+ and F
  // const mvrs = all.map(o => calculateMvr(o.para_summary.ev, o.para_summary.iv, o.para_summary.mv));
  // // filter A+ validators
  // const gradeAplus = mvrs.filter(mvr => grade(1 - mvr) === "A+")
  // // const averageMvrGradeAplus = Math.round((gradeAplus.reduce((p, c) => p + c, 0) / gradeAplus.length) * 10000) / 10000
  // // filter F validators
  // const gradeF = mvrs.filter(mvr => grade(1 - mvr) === "F")
  // const averageMvrGradeF = Math.round((gradeF.reduce((p, c) => p + c, 0) / gradeF.length) * 10000) / 10000
  
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
        {/* {!isUndefined(gradeAplus) && !isUndefined(gradeF) ? 
          <Typography variant="subtitle2">{(gradeAplus.length * 100) / all.length}% of para validators in the current session have an exceptional performance (A+)</Typography> : null}
          <Typography variant="subtitle2">{(gradeF.length * 100) / all.length}% have a low performance (F) with an average missed vote ratio of {averageMvrGradeF}</Typography> */}
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