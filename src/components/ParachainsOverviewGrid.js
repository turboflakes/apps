import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy'
import isNumber from 'lodash/isNumber'
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ParachainCard from './ParachainCard';
import { 
  selectValidatorsAll
 } from '../features/api/validatorsSlice'

function createValidatorData(address, identity, e, i, m, p) {
  return { address, identity, e, i, m, p };
}

export default function ParachainsOverviewGrid({sessionIndex}) {
	// const theme = useTheme();
  const allValidators = useSelector(selectValidatorsAll)

  // Filter validators by authority, p/v and session
  const filtered = allValidators.filter(o => o.is_auth && o.is_para && o.session === sessionIndex);
  
  // Group validators by paraID
  const groupedByParaId = groupBy(filtered, (o) => o.para.pid)

  const parachains = Object.values(groupedByParaId).map(o => {
    const paraId = o[0].para.pid
    const groupId = o[0].para.group
    const coreAssignments = o[0].para_summary.ca
    const validators = o.map(v => { if (v.is_auth && v.is_para) { 
        const pt = v.ep - v.sp
        return createValidatorData(v.address, v.identity, v.para_summary.ev, v.para_summary.iv, v.para_summary.mv, pt)
      } else {
        return createValidatorData('', '', 0, 0, 0, 0)
      }
    });
    return {
      paraId,
      groupId,
      coreAssignments,
      validators,
    }
  }).filter(o => !isNull(o.paraId))
  
  return (
		<Box sx={{ m: 0 }}>
      <Box
        sx={{
          p: 2,
          // m: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 120,
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box>
            <Typography variant="h4">Parachains</Typography>
            <Typography variant="subtitle2">Attestations of Validity by Parachain</Typography>
          </Box>
          <Box>
            <Paper sx={{ p: 2, width: 176, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
              <Typography variant="caption">Parachains scheduled</Typography>
              <Typography variant="h5">{parachains.length}</Typography>
            </Paper>
          </Box>
        </Box>
        {/* {!isUndefined(gradeAplus) && !isUndefined(gradeF) ? 
          <Typography variant="subtitle2">{(gradeAplus.length * 100) / filtered.length}% of para validators in the current session have an exceptional performance (A+)</Typography> : null}
          <Typography variant="subtitle2">{(gradeF.length * 100) / filtered.length}% have a low performance (F) with an average missed vote ratio of {averageMvrGradeF}</Typography> */}
      </Box>
      <Grid container spacing={2}>
          {Object.values(parachains).map((p, i) => (
            <Grid item xs={12} md={3} key={i}>
              <ParachainCard paraId={p.paraId} validators={p.validators} groupId={p.groupId} coreAssignments={p.coreAssignments} />
            </Grid>
          ))}
      </Grid>
		</Box>
  );
}