import * as React from 'react';
import { useSelector } from 'react-redux';
import isNull from 'lodash/isNull';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SortIcon from '@mui/icons-material/Sort';
import PoolCard from './PoolCard';
import PoolsStateToggle from './PoolsStateToggle';
import { 
  selectPoolIdsBySessionSortedBy,
 } from '../features/api/sessionsSlice';

export default function PoolsGrid({sessionIndex}) {
  const [sortBy, setSortBy] = React.useState('apr');
  const [stateFilter, setStateFilter] = React.useState('Open');
	const poolIds = useSelector(state => selectPoolIdsBySessionSortedBy(state, sessionIndex, sortBy, stateFilter));
  
  const handleSort = (event, newSortBy) => {
    if (isNull(newSortBy)) {
      return
    }
    setSortBy(newSortBy);
  };

  const handleStateChanged = (newValue) => {
    setStateFilter(newValue)
  }

  return (
		<Box sx={{ m: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Nomination Pools</Typography>
          {/* {isLiveMode ? 
            <Typography variant="subtitle" color="secondary">
              Attestations of Validity by Val. Groups
            </Typography> :
            <Typography variant="subtitle" color="secondary">
              Attestations of Validity by Val. Groups at session {sessionIndex.format()}
            </Typography>} 
            */}
        </Box>
        <ToggleButtonGroup
            value={sortBy}
            size="small"
            exclusive
            onChange={handleSort}
            sx={{ display: 'flex', alignItems: 'center'	}}
          >
          <ToggleButton value="points" aria-label="Sort by Points" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, mr: 1, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by Points</Box><SortIcon />
          </ToggleButton>
          <ToggleButton value="members" aria-label="Sort by Members" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, mr: 1, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by Members</Box><SortIcon />
          </ToggleButton>
          <ToggleButton value="apr" aria-label="Sort by APR" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by APR</Box><SortIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ px: 2, display: 'flex', justifyContent: 'space-between'}}>
        <PoolsStateToggle onChange={handleStateChanged} />
        <Typography variant="caption" paragraph>total: {poolIds.length}</Typography>
      </Box>
      <Grid container spacing={2}>
        {poolIds.map(poolId => (
          <Grid item xs={12} md={3} key={poolId}>
            <PoolCard sessionIndex={sessionIndex} poolId={poolId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}