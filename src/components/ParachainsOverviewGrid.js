import * as React from 'react';
import { useSelector } from 'react-redux';
// import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SortIcon from '@mui/icons-material/Sort';
import ParachainCard from './ParachainCard';
import { 
  useGetParachainsQuery,
 } from '../features/api/parachainsSlice';
import {
  selectIsLiveMode,
} from '../features/layout/layoutSlice';
import { 
  selectSessionByIndex,
  selectParachainIdsBySessionSortedBy,
  selectScheduledParachainsBySession
} from '../features/api/sessionsSlice';


export default function ParachainsOverviewGrid({sessionIndex}) {
	// const theme = useTheme();
  const [sortBy, setSortBy] = React.useState('');
  const {isSuccess} = useGetParachainsQuery({session: sessionIndex}, {refetchOnMountOrArgChange: true});
  const paraIds = useSelector(state => selectParachainIdsBySessionSortedBy(state, sessionIndex, sortBy));
  const nScheduled = useSelector(state => selectScheduledParachainsBySession(state, sessionIndex, sortBy));
  const isLiveMode = useSelector(selectIsLiveMode);
  const session = useSelector(state => selectSessionByIndex(state, sessionIndex));
  
  if (!isSuccess) {
    return null
  }

  const pScheduled = Math.round(nScheduled * 100 / paraIds.length);

  const handleSort = (event, newSortBy) => {
    setSortBy(newSortBy);
  };
  
  return (
    <Box sx={{ m: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Parachains</Typography>
          {isLiveMode ? 
            <Typography variant="subtitle" color="secondary">
              Attestations of Validity by Parachain
            </Typography> :
            <Typography variant="subtitle" color="secondary">
              Attestations of Validity by Parachain at history [{session.eix} // {sessionIndex}]
            </Typography>}
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
        <Typography variant="caption" paragraph>Parachains scheduled: {nScheduled} ({pScheduled}%)</Typography>
      </Box>
      <Grid container spacing={2}>
        {paraIds.map(paraId => (
          <Grid item xs={12} md={3} key={paraId}>
            <ParachainCard sessionIndex={sessionIndex} paraId={paraId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}