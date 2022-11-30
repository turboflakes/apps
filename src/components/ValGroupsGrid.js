import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SortIcon from '@mui/icons-material/Sort';
import ValGroupCard from './ValGroupCard';
import { 
  selectValGroupIdsBySessionSortedBy
 } from '../features/api/sessionsSlice'

export default function ValGroupsGrid({sessionIndex}) {
  const [sortBy, setSortBy] = React.useState('');
	const groupIds = useSelector(state => selectValGroupIdsBySessionSortedBy(state, sessionIndex, sortBy));
  
  const handleSort = (event, newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
		<Box sx={{ m: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Val. Groups</Typography>
          <Typography variant="subtitle" color="secondary">Attestations of Validity by Val. Groups</Typography>
        </Box>
        <ToggleButtonGroup
            value={sortBy}
            size="small"
            exclusive
            onChange={handleSort}
            sx={{ display: 'flex', alignItems: 'center'	}}
          >
          <ToggleButton value="backing_points" aria-label="Sort by Backing Points" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, mr: 1, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:last-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by Backing Points</Box><SortIcon />
          </ToggleButton>
          <ToggleButton value="mvr" aria-label="Sort by Missed Vote Ratio" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by Missed Vote Ratio</Box><SortIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ px: 2, display: 'flex', justifyContent: 'flex-end'}}>
        <Typography variant="caption" paragraph>Val. Groups total: {groupIds.length}</Typography>
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