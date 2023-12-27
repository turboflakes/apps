import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
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
  selectValGroupIdsBySessionSortedBy,
  selectCoreIdsBySession
 } from '../features/api/sessionsSlice';
import {
  selectIsLiveMode,
} from '../features/layout/layoutSlice';
import {
  chainInfoChanged,
  addressChanged,
  selectChain,
} from '../features/chain/chainSlice';
import { getTotalCores } from '../constants';

function FreeCore() {
  const theme = useTheme();
  return (<Box sx={{
    width: theme.spacing(10),
    height: theme.spacing(10),
    bgcolor: theme.palette.background.paper,
    m: theme.spacing(1/4),
    border: '2px solid #000',
  }}></Box>)
}

function OccupiedCore({id}) {
  const theme = useTheme();
  return (<Box sx={{
    width: theme.spacing(10),
    height: theme.spacing(10),
    bgcolor: theme.palette.grade["A+"],
    // bgcolor: theme.palette.background.secondary,
    m: theme.spacing(1/4),
    border: '2px solid #000',
  }}></Box>)
}

export default function CoresGrid({sessionIndex}) {
  const theme = useTheme();
  const [sortBy, setSortBy] = React.useState('group_id');
  const [orderBy, setOrderBy] = React.useState(false); // true -> asc; false -> desc
  const [page, setPage] = React.useState(0);
  const [identityFilter, setIdentityFilter] = React.useState('');
  const selectedChain = useSelector(selectChain);
	// const groupIds = useSelector(state => selectValGroupIdsBySessionSortedBy(state, sessionIndex, sortBy, orderBy, identityFilter));
  const coreIds = useSelector(state => selectCoreIdsBySession(state, sessionIndex));

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
          <Typography variant="h4">Cores</Typography>
          <Typography variant="subtitle">
            Core Assignments
          </Typography>
        </Box>
        
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%'}}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', 
          maxWidth: 888, 
          borderRadius: 3,
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          bgcolor: '#fff',
          
          }} >
          {[...Array(getTotalCores(selectedChain)).keys()].map(i => coreIds.includes(i) ? <OccupiedCore id={i} /> : <FreeCore />)}
        </Box>
      </Box>
      
		</Box>
  );
}