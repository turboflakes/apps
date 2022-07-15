import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ValGroupCard from './ValGroupCard';
import { 
  useGetValidatorsQuery,
  selectValidatorsAll
 } from '../features/api/validatorsSlice'
 import { 
  useGetSessionByIndexQuery,
  selectSessionsAll,
 } from '../features/api/sessionsSlice'
 import {
  selectChain
} from '../features/chain/chainSlice';

export const ValGroupsGrid = ({sessionIndex}) => {
	// const theme = useTheme();
  const {data, isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "para_authority"}, {refetchOnMountOrArgChange: true});
  const selectedChain = useSelector(selectChain);
  const allValidators = useSelector(selectValidatorsAll)

  if (!isSuccess) {
    return null
  }

  // Group validators by ValGroups
  const filtered = allValidators.filter(o => o.is_auth && o.is_para);
  const groups = groupBy(filtered, (o) => o.para.group)
  
  return (
		<Box sx={{ m: 2 }}>
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