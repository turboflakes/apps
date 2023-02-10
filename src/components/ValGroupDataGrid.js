import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Identicon from '@polkadot/react-identicon';
import DetailsIcon from './DetailsIcon';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice'
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
  // { 
  //   field: 'id', 
  //   headerName: '#', 
  //   width: 48,
  //   sortable: false,
  //   disableColumnMenu: true,
  //   valueGetter: (params) => {
  //     return codes[params.row.id-1]
  //   },
  // },
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
      const mvr = calculateMvr(params.row.e, params.row.i, params.row.m)
      const gradeValue = grade(1-mvr);
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
    field: 'b',
    headerName: '❒',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'i',
    headerName: '✓i',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'e',
    headerName: '✓e',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'm',
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
    valueGetter: (params) => {
      return calculateMvr(params.row.e, params.row.i, params.row.m)
    },
  },
  {
    field: 'pp',
    headerName: 'Backing Points',
    type: 'number',
    width: 128,
    disableColumnMenu: true,
    valueGetter: (params) => {
      if (params.row.p === 0) {
        return 0
      }
      return params.row.p - (params.row.b * 20)
    },
  },
  {
    field: 'p',
    headerName: 'Total Points',
    type: 'number',
    width: 128,
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
]};

function createDataGridRows(id, identity, address, b, i, e, m, p) {
  return {id, identity, address, b, i, e, m, p };
}

export default function ValGroupDataGrid({sessionIndex, groupId}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedChain = useSelector(selectChain);
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));
  const selectedAddress = useSelector(selectAddress);
  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let sorted = validators.sort((a, b) => ((b.auth.ep - b.auth.sp) - (a.auth.ep - a.auth.sp)));

  const rows = sorted.map((v, i) => {
    if (v.is_auth && v.is_para) {
      const authored_blocks = v.auth.ab.length;
      const total_points = v.auth.ep - v.auth.sp;
      return createDataGridRows(i+1, 
        nameDisplay(!!v.profile ? v.profile._identity : stashDisplay(v.address, 6), 36, selectedAddress === v.address ? '★ ' : ''), 
        v.address, 
        authored_blocks, 
        v.para_summary.iv, 
        v.para_summary.ev, 
        v.para_summary.mv, 
        total_points)
    } else {
      return createDataGridRows(i+1, '-', '', 0, 0, 0, 0, 0)
    }
  })
  const columns = defineColumns(theme);

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 400,
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
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          hideFooter
          disableSelectionOnClick
        />
    </Paper>
  );
}