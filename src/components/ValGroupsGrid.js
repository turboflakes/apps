import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy'
import isNumber from 'lodash/isNumber'
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupCard from './ValGroupCard';
import { 
  selectValidatorsAll
 } from '../features/api/validatorsSlice'
import { calculateMvr } from '../util/mvr'
import { grade } from '../util/grade'

export default function ValGroupsGrid({sessionIndex}) {
	// const theme = useTheme();
  const allValidators = useSelector(selectValidatorsAll)

  // Filter validators by authority, p/v and session
  const filtered = allValidators.filter(o => o.is_auth && o.is_para && o.session === sessionIndex);

  // Group validators by groupID
  const groupedByValGroupId = groupBy(filtered, o => o.para.group);

  // Calculate mvr to get number of validators A+ and F
  const mvrs = filtered.map(o => calculateMvr(o.para_summary.ev, o.para_summary.iv, o.para_summary.mv));
  // filter A+ validators
  const gradeAplus = mvrs.filter(mvr => grade(1 - mvr) === "A+")
  // const averageMvrGradeAplus = Math.round((gradeAplus.reduce((p, c) => p + c, 0) / gradeAplus.length) * 10000) / 10000
  // filter F validators
  const gradeF = mvrs.filter(mvr => grade(1 - mvr) === "F")
  const averageMvrGradeF = Math.round((gradeF.reduce((p, c) => p + c, 0) / gradeF.length) * 10000) / 10000
  
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
        {!isUndefined(gradeAplus) && !isUndefined(gradeF) ? 
          <Typography variant="subtitle2">{(gradeAplus.length * 100) / filtered.length}% of para validators in the current session have an exceptional performance (A+)</Typography> : null}
          <Typography variant="subtitle2">{(gradeF.length * 100) / filtered.length}% have a low performance (F) with an average missed vote ratio of {averageMvrGradeF}</Typography>
      </Box>
      <Grid container spacing={2}>
        {Object.values(groupedByValGroupId).map((validators, i) => (
          <Grid item xs={12} md={3} key={i}>
            <ValGroupCard validators={validators} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}