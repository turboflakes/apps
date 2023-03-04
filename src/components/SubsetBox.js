import * as React from 'react';
import { useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SubsetPieChart from './SubsetPieChart';
import {
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import { 
  selectSessionHistoryRangeIds,
} from '../features/api/sessionsSlice'


export default function SubsetBox({sessionIndex, isHistoryMode}) {
  // const theme = useTheme();
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, isHistoryMode ? historySessionRangeIds : [sessionIndex], isHistoryMode));
  
  if (!rows.length) {
    return null
  }

  const groupedBySubset = groupBy(rows, v => v.subset);
  const data = orderBy(Object.keys(groupedBySubset).map(subset => ({ subset, value: groupedBySubset[subset].length })), 'subset');
  
  return (
    <Paper sx={{ 
      // m: 2,
      // p: 2,
      display: 'flex',
      flexDirection: 'column',
      // justifyContent: 'center',
      // alignItems: 'center',
      width: '100%',
      // width: 352,
      height: 352,
      borderRadius: 3,
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <Box sx={{p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box sx={{ display: 'flex', width: "80%"}}>
            <Box sx={{mr: 1,
              whiteSpace: "nowrap", 
              overflow: "hidden", 
              textOverflow: "ellipsis"
            }}>
              <Box sx={{ display: 'flex'}}>
                <Typography variant="h6" sx={{ mr: 1, overflow: "hidden", textOverflow: "ellipsis" }} title="Distribution by subset">
                Distribution by subset
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ height: 16, overflow: "hidden", textOverflow: "ellipsis" }} paragraph>
                All active validators
              </Typography>
            </Box>
          </Box>
          <Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center'}}>
          <SubsetPieChart data={data} size="md" showLegend showLabel />
        </Box>
      </Box>
    </Paper>
  )
}