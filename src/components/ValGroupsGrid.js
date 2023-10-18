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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownWideShort, faArrowUpWideShort } from '@fortawesome/free-solid-svg-icons'
import InputAdornment from '@mui/material/InputAdornment';
import ValGroupCard from './ValGroupCard';
import PaginationBox from './PaginationBox';
import { 
  selectValGroupIdsBySessionSortedBy
 } from '../features/api/sessionsSlice';
import {
  selectIsLiveMode,
} from '../features/layout/layoutSlice';

const PAGE_SIZE = 16;

export default function ValGroupsGrid({sessionIndex}) {
  const [sortBy, setSortBy] = React.useState('group_id');
  const [orderBy, setOrderBy] = React.useState(false); // true -> asc; false -> desc
  const [page, setPage] = React.useState(0);
  const [identityFilter, setIdentityFilter] = React.useState('');
	const groupIds = useSelector(state => selectValGroupIdsBySessionSortedBy(state, sessionIndex, sortBy, orderBy, identityFilter));
  const isLiveMode = useSelector(selectIsLiveMode);

  const handleSort = (event, newSortBy) => {
    if (isNull(newSortBy)) {
      setOrderBy(!orderBy);
      return
    }
    setSortBy(newSortBy);
  };

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
          <Typography variant="h4">Val. Groups</Typography>
          {isLiveMode ? 
            <Typography variant="subtitle">
              Attestations of Validity by Val. Groups
            </Typography> :
            <Typography variant="subtitle">
              Attestations of Validity by Val. Groups at session {sessionIndex.format()}
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
            <Box sx={{mr: 1}}>Sort by Backing Points</Box>
            {orderBy ? <FontAwesomeIcon icon={faArrowDownWideShort} /> : <FontAwesomeIcon icon={faArrowUpWideShort} />}
          </ToggleButton>
          <ToggleButton value="mvr" aria-label="Sort by Missed Vote Ratio" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, mr: 1, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by Missed Vote Ratio</Box>
            {orderBy ? <FontAwesomeIcon icon={faArrowDownWideShort} /> : <FontAwesomeIcon icon={faArrowUpWideShort} />}
          </ToggleButton>
          <ToggleButton value="group_id" aria-label="Sort by Val. Group ID" 
            disableRipple
            disableFocusRipple
            sx={{ px: 2, border: 0, '&.Mui-selected' : {borderRadius: 16}, '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {borderRadius: 16}}}>
            <Box sx={{mr: 1}}>Sort by Val. Group ID</Box>
            {orderBy ? <FontAwesomeIcon icon={faArrowDownWideShort} /> : <FontAwesomeIcon icon={faArrowUpWideShort} />}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ mx: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <TextField
          sx={{
            // backgroundColor: theme.palette.neutrals[100],
            borderRadius: 30,
            width: 512
          }}
          variant="outlined"
          placeholder="Filter by Group ID or Validator Identity/Address"
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
        <PaginationBox page={page} totalSize={groupIds.length} pageSize={PAGE_SIZE} onChange={handlePageChange} />
      </Box>
      <Grid container spacing={2}>
        {groupIds.slice(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE).map(groupId => (
          <Grid item xs={12} md={3} key={groupId}>
            <ValGroupCard sessionIndex={sessionIndex} groupId={groupId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}