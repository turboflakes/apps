import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { grade } from '../util/grade'

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
    field: 'n',
    headerName: 'Identity',
    width: 256,
    disableColumnMenu: true,
    // valueGetter: (params) => {
    //   return names[params.row.id-1].identity
    // },
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
      const mvr = calculate_mvr(params.row.e, params.row.i, params.row.m)
      return grade(1-mvr)
    },
  },
  {
    field: 'mvr',
    headerName: 'MVR',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    valueGetter: (params) => {
      return calculate_mvr(params.row.e, params.row.i, params.row.m)
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

const calculate_mvr = (e, i, m) => {
  const total = e + i + m;
  if (total === 0) {
    return undefined
  } 
  return m / total
}

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