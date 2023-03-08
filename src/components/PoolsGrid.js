import * as React from 'react';
import { useSelector } from 'react-redux';
import isNull from 'lodash/isNull';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SortIcon from '@mui/icons-material/Sort';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import PoolCard from './PoolCard';
import PoolsStateToggle from './PoolsStateToggle';
import PaginationBox from './PaginationBox';
import { 
  selectPoolIdsBySessionSortedBy,
 } from '../features/api/sessionsSlice';

const PAGE_SIZE = 16;

export default function PoolsGrid({sessionIndex}) {
  const [sortBy, setSortBy] = React.useState('apr');
  const [stateFilter, setStateFilter] = React.useState('Open');
  const [identityFilter, setIdentityFilter] = React.useState('');
  const [page, setPage] = React.useState(0);
	const poolIds = useSelector(state => selectPoolIdsBySessionSortedBy(state, sessionIndex, sortBy, identityFilter, stateFilter));
  
  const handleSort = (event, newSortBy) => {
    if (isNull(newSortBy)) {
      return
    }
    setSortBy(newSortBy);
  };

  const handleStateChanged = (newValue) => {
    setStateFilter(newValue)
  }

  const handleIdentityFilter = (event) => {
    setIdentityFilter(event.target.value)
    if (page !== 0) {
      setPage(0)
    }
  }

  const handlePageChange = (page) => {
    setPage(page)
  }

  return (
		<Box sx={{ m: 0 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h4">Nomination Pools</Typography>
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
      <Box sx={{ mx: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <TextField
            sx={{
              // backgroundColor: theme.palette.neutrals[100],
              borderRadius: 30,
              width: 512
            }}
            variant="outlined"
            placeholder="Filter by Pool Name or Nominee Identity"
            color="primary"
            value={identityFilter}
            onChange={handleIdentityFilter}
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton sx={{ ml: 1}} size="small">
                    <SortIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                borderRadius: 30,
                paddingLeft: '4px',
                '> .MuiOutlinedInput-input': {
                  fontSize: "0.925rem",
                  height: "24px",
                  // fontSize: "0.825rem",
                  // lineHeight: "1rem",
                },
              }
            }}
          />
          <PoolsStateToggle onChange={handleStateChanged} />
        </Box>
        <PaginationBox page={page} totalSize={poolIds.length} pageSize={PAGE_SIZE} onChange={handlePageChange} />
      </Box>
      <Grid container spacing={2}>
        {poolIds.slice(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE).map(poolId => (
          <Grid item xs={12} md={3} key={poolId}>
            <PoolCard sessionIndex={sessionIndex} poolId={poolId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}