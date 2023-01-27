import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Skeleton from '@mui/material/Skeleton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Identicon from '@polkadot/react-identicon';
import { grade } from '../util/grade'
import {
  useGetValidatorsQuery,
  selectValidatorsInsightsBySessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice'
import { 
  selectSessionHistoryRange,
  selectSessionHistory
} from '../features/api/sessionsSlice'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';

function DetailsIcon({address}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);

  const handleOnClick = () => {
    if (selectedAddress !== address) {
      dispatch(addressChanged(address));
      dispatch(pageChanged(`validator/${address}`));
      navigate(`/one-t/${selectedChain}/validator/${address}`)
    }
  };

  return (
    <IconButton color="primary" onClick={handleOnClick} align="right">
      <ZoomInIcon />
    </IconButton>
  )
}

const defineColumns = (theme) => {
  return [
  { 
      field: 'id', 
      headerName: '', 
      width: 48,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (params.row.address) {
          return (
              <Identicon
                value={params.row.address}
                size={24}
                theme={'polkadot'} />
            )
        }
        return (<div>-</div>)  
      }
    },
  {
    field: 'identity',
    headerName: 'Identity',
    width: 288,
    disableColumnMenu: true,
  },
  {
    field: 'grade',
    headerName: 'Grade',
    width: 64,
    headerAlign: 'right',
    align: 'left',
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      const gradeValue = grade(1-params.row.mvr);
      return (
        <Box>
          <Box sx={{ width: '8px', height: '8px', borderRadius: '50%', 
                      bgcolor: theme.palette.grade[gradeValue], 
                      display: "inline-block" }}>
          </Box>
          <Box sx={{ml: 1,  display: "inline-block"}}>{gradeValue}</Box>
        </Box>)
    }
  },
  {
    field: 'subset',
    headerName: 'Subset',
    width: 96,
    headerAlign: 'left',
    align: 'left',
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'active_sessions',
    headerName: 'Active Sessions',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'para_sessions',
    headerName: 'P/A Sessions',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'authored_blocks',
    headerName: '❒',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'core_assignments',
    headerName: '↻',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'implicit_votes',
    headerName: '✓i',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'explicit_votes',
    headerName: '✓e',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'missed_votes',
    headerName: '✗',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'mvr',
    headerName: 'MVR',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    valueGetter: (params) => Math.round(params.row.mvr * 10000) / 10000,
  },
  {
    field: 'avg_pts',
    headerName: 'Avg. Backing Points',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    valueGetter: (params) => Math.round(params.row.avg_pts),
  },
  {
    field: 'score',
    headerName: 'Score',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    sortingOrder: ['asc', 'desc']
  },
  {
    field: 'timeline',
    headerName: 'Timeline',
    width: 384,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      if (params.row.isFetching) {
        return (<Skeleton variant="text" sx={{ width: 384, fontSize: '0.825rem' }} />)
      }
      return (<span>{params.row.timeline}</span>)
    }
  },
  {
    field: 'options',
    headerName: '', 
    width: 96,
    align: 'right',
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {

      if (!params.row.address) {
        return null
      } 
      return (
        <DetailsIcon address={params.row.address} />
      )
    }
  }
]};

export default function ValidatorsHistoryDataGrid({sessionIndex, skip, identityFilter, subsetFilter, maxSessions, isFetching}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);
  const historySessionIds = buildSessionIdsArrayHelper(sessionIndex, maxSessions);
  const historySessionRange = useSelector(selectSessionHistoryRange);
  const historySession = useSelector(selectSessionHistory);
  // const {isSuccess} = useGetValidatorsQuery({sessions: (isUndefined(historySessionRange) ? [historySession-6, historySession]: historySessionRange).join(","), show_summary: true, show_profile: true}, {skip});  
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, historySessionIds, identityFilter, subsetFilter, isFetching));

  if (isUndefined(rows)) {
    return null
  }

  const columns = defineColumns(theme);

  const rowsFiltered = rows.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) !== 'F' : false);
  
  // const handleOnRowClick = ({row}) => {
  //   const address = row.address;
  //   if (selectedAddress !== address) {
  //     dispatch(addressChanged(address));
  //     dispatch(pageChanged(`validator/${address}`));
  //     navigate(`/one-t/${selectedChain}/validator/${address}`)
  //   }
  // };

  return (
    <Box
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <DataGrid
          sx={{ bgcolor: '#FFF', width: '100%', borderRadius: 0, border: 0,
            '& .MuiDataGrid-footerContainer': {
              borderTop: 0
            },
            '& .MuiDataGrid-cell:focus': {
              border: 0
            }
          }}
          initialState={{
            pagination: {
              pageSize: 16,
            },
            sorting: {
              sortModel: [{ field: 'score', sort: 'desc' }],
            },
          }}
          // onRowClick={handleOnRowClick}
          rows={rowsFiltered}
          columns={columns}
          rowsPerPageOptions={[16]}
          pagination
          disableSelectionOnClick
        />
    </Box>
  );
}