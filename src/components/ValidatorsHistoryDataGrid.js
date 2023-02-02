import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import isNull from 'lodash/isNull'
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { DataGrid } from '@mui/x-data-grid';
import Skeleton from '@mui/material/Skeleton';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Identicon from '@polkadot/react-identicon';
import { grade } from '../util/grade'
import {
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import { 
  selectSessionHistoryRangeIds,
} from '../features/api/sessionsSlice'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectIdentityFilter,
  selectSubsetFilter,
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
      if (!isNull(params.row.mvr)) {
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
      return ('-')
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
    valueGetter: (params) => (!isNull(params.row.mvr) ? Math.round(params.row.mvr * 10000) / 10000 : null),
  },
  {
    field: 'avg_pts',
    headerName: 'Avg. Backing Points',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    valueGetter: (params) => (!isNull(params.row.avg_pts) ? Math.round(params.row.avg_pts) : null),
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
    field: 'options',
    headerName: '', 
    width: 80,
    align: 'center',
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
  },
  {
    field: 'timeline',
    headerName: 'Timeline',
    width: 320,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      if (params.row.isFetching) {
        return (<Skeleton variant="text" sx={{ minWidth: 128, fontSize: '0.825rem' }} />)
      }
      return (<span>{params.row.timeline}</span>)
    }
  }
]};

export default function ValidatorsHistoryDataGrid({isFetching}) {
  const theme = useTheme();
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);
  const historySessionRangeIds = useSelector(selectSessionHistoryRangeIds);
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, historySessionRangeIds, true, identityFilter, subsetFilter, isFetching));
  const [viewAll, setViewAll] = React.useState(false);

  if (isUndefined(rows)) {
    return null
  }

  const columns = defineColumns(theme);

  const rowsFiltered = viewAll ? rows : rows.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) !== 'F' : false);
  const gradeFsCounter = rows.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) === 'F' : false).length;

  const handleViewAllChange = (event) => {
    setViewAll(event.target.checked);
  };
  
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
        <FormGroup>
          <FormControlLabel control={
            <Switch size="small" disabled={gradeFsCounter === 0} checked={viewAll} onChange={handleViewAllChange}/>
          } 
          label="View All" 
          sx={{
            '& .MuiFormControlLabel-label' : {
              ...theme.typography.caption
            }
          }}/>
          <FormHelperText>Note: {gradeFsCounter} validators with grade <b>F</b> are hidden by default</FormHelperText>
        </FormGroup>
    </Box>
  );
}