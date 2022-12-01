import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Identicon from '@polkadot/react-identicon';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'
import {
  useGetValidatorsQuery,
  selectValidatorsInsightsBySessions
} from '../features/api/validatorsSlice'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  pageChanged
} from '../features/layout/layoutSlice';
import { stashDisplay, nameDisplay } from '../util/display'

// const codes = ['★', 'A', 'B', 'C', 'D']

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
    field: 'subset',
    headerName: 'Subset',
    width: 96,
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
  },
]};

export default function ValidatorsDataGrid({sessionIndex}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const selectedAddress = useSelector(selectAddress);
  const {data: data3} = useGetValidatorsQuery({session: sessionIndex - 2, role: "para_authority", show_summary: true, show_profile: true}, {refetchOnMountOrArgChange: true});
  const {data: data2} = useGetValidatorsQuery({session: sessionIndex - 1, role: "para_authority", show_summary: true, show_profile: true}, {refetchOnMountOrArgChange: true});
  const {data: data1, isSuccess} = useGetValidatorsQuery({session: sessionIndex - 3, role: "para_authority", show_summary: true, show_profile: true}, {refetchOnMountOrArgChange: true});
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, [sessionIndex - 1, sessionIndex - 2, sessionIndex - 3]));

  // console.log('__validators', rows);

  if (isUndefined(rows)) {
    return null
  }

  // const validators = [data1, data2];

  // // sort by session
  // const sorted = validators.sort((a, b) => b.session - a.session);
  // // const groupedByAddress = groupBy(sorted, v => !!v.session ? v.session : action.payload.session)
  // // console.log('__sorted', sorted);


  const columns = defineColumns(theme);

  const handleOnRowClick = ({row}) => {
    const address = row.address;
    if (selectedAddress !== address) {
      dispatch(addressChanged(address));
      dispatch(pageChanged(`validator/${address}`));
      navigate(`/one-t/${selectedChain}/validator/${address}`)
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '2768px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Validators</Typography>
          </Box>
        </Box>
        <DataGrid
          sx={{ bgcolor: '#FFF', width: '100%', borderRadius: 0, border: 0,
          '& .MuiDataGrid-footerContainer': {
            borderTop: 0
          } }}
          initialState={{
            pagination: {
              pageSize: 50,
            },
            sorting: {
              sortModel: [{ field: 'score', sort: 'desc' }],
            },
          }}
          // onRowClick={handleOnRowClick}
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[50]}
          pagination
          disableSelectionOnClick
        />
    </Paper>
  );
}

{/* <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '2868px',
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6">Validators</Typography>
          </Box>
        </Box>
        <DataGrid
          sx={{ bgcolor: '#FFF', width: '100%', borderRadius: 0, border: 0 }}
          initialState={{
            // pagination: {
            //   pageSize: 50,
            // },
            sorting: {
              sortModel: [{ field: 'score', sort: 'desc' }],
            },
          }}
          rows={rows}
          columns={columns}
          // pageSize={100}
          rowsPerPageOptions={[50, 100]}
          pagination
          hideFooter
          disableSelectionOnClick
          onRowClick={handleOnRowClick}
        />
    </Paper> */}