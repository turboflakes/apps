import * as React from 'react';
import isUndefined from 'lodash/isUndefined'
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Identicon from '@polkadot/react-identicon';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'

const codes = ['★', 'A', 'B', 'C', 'D']

const columns = [
  { 
    field: 'id', 
    headerName: '#', 
    width: 48,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params) => {
      return codes[params.row.id-1]
    },
  },
  {
    field: 'identity',
    headerName: 'Identity',
    width: 256,
    disableColumnMenu: true,
    // valueGetter: (params) => {
    //   return names[params.row.address-1].identity
    //   // return (<div>teste</div>)
    // },
    renderCell: (params) => {
      if (params.row.address) {
        return (
          <span style={{ display: 'flex', justifyContent: 'center'}}>
            <Identicon
              value={params.row.address}
              size={24}
              theme={'polkadot'} />
              <span style={{ marginLeft: '8px'}}>{params.row.identity}</span>
          </span>
          )
      }
      return (<div>teste</div>)  
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
    field: 'grade',
    headerName: 'Grade',
    width: 64,
    headerAlign: 'right',
    align: 'right',
    disableColumnMenu: true,
    valueGetter: (params) => {
      const mvr = calculateMvr(params.row.e, params.row.i, params.row.m)
      if (!isUndefined(mvr)) {
        return grade(1-mvr)
      }
      return '-'
    },
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
    headerName: 'P/V Points',
    type: 'number',
    width: 96,
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
    headerName: 'Points',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
  },
];

export default function ValGroupDataGrid({rows}) {
  
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