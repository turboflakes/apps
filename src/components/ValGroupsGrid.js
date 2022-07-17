import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy'
import isUndefined from 'lodash/isUndefined'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupCard from './ValGroupCard';
import { 
  useGetValidatorsQuery,
  selectValidatorsAll
 } from '../features/api/validatorsSlice'
import { calculateMvr } from '../util/mvr'
import { grade } from '../util/grade'

export const ValGroupsGrid = ({sessionIndex}) => {
	// const theme = useTheme();
  const {isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority"}, {refetchOnMountOrArgChange: true});
  const allValidators = useSelector(selectValidatorsAll)

  if (!isSuccess) {
    return null
  }

  // Filter validators by authority, p/v and session
  const filtered = allValidators.filter(o => o.is_auth && o.is_para && o.session === sessionIndex);
  // Group validators by groupID
  const groups = groupBy(filtered, (o) => o.para.group)

  
  const mvrs = filtered.map(o => {
    const stats = Object.values(o.para.para_stats)
    const e = stats.map(o => o.explicit_votes).reduce((p, c) => p + c, 0)
    const i = stats.map(o => o.implicit_votes).reduce((p, c) => p + c, 0)
    const m = stats.map(o => o.missed_votes).reduce((p, c) => p + c, 0)
    return calculateMvr(e, i, m)
  })
  // filter A+ validators
  const gradeAplus = mvrs.filter(mvr => grade(1 - mvr) === "A+")
  // const averageMvrGradeAplus = Math.round((gradeAplus.reduce((p, c) => p + c, 0) / gradeAplus.length) * 10000) / 10000
  // filter F validators
  const gradeF = mvrs.filter(mvr => grade(1-mvr) === "F")
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
          {Object.values(groups).map((g, i) => (
            <Grid item xs={12} md={3} key={i}>
              <ValGroupCard groupId={i} validators={g} />
            </Grid>
          ))}
      </Grid>
		</Box>
  );
}