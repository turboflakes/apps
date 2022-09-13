import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { DataGrid } from '@mui/x-data-grid';
import {
  selectChain
} from '../../features/chain/chainSlice';
import { isChainSupported, getChainNameShort, getChainColor } from '../../constants'

function createData(id, m, b, i, e, mvr, pp, tp) {
  return { id, m, b, i, e, mvr, pp, tp };
}

// const data = [
//   createData('*',58,70,5,0.0376),
//   createData('A',0,132,1,0.0075),
//   createData('B',1,131,1,0.0075),
//   createData('C',73,27,33,0.2481),
//   createData('D',30,101,2,0.015),
// ];
const rows = [
  createData(1,5,1,58,70,0.0376,2680,2700),
  createData(2,1,0,0,132,0.0075,2760,2760),
  createData(3,1,0,1,131,0.0075,2760,2760),
  createData(4,33,2,73,27,0.2481,2060,2100),
  createData(5,2,0,30,101,0.015,2740,2740),
] 


const names = [
  {code: '*', identity: 'turboflakes.io/MOMO'}, 
  {code: 'A', identity: 'Caz16n...E9BNuf'},
  {code: 'B', identity: 'POLKACHU.COM/04'},
  {code: 'C', identity: 'Zug_Capital/38'},
  {code: 'D', identity: 'RYABINA/_[6]_T.ME/KUSAMA'},
  
]

const columns = [
  { 
    field: 'id', 
    headerName: '#', 
    width: 60,
    sortable: false,
    disableColumnMenu: true,
    valueGetter: (params) => {
      return names[params.row.id-1].code
    },
  },
  {
    field: 'identity',
    headerName: 'Identity',
    width: 220,
    disableColumnMenu: true,
    valueGetter: (params) => {
      return names[params.row.id-1].identity
    },
  },
  {
    field: 'b',
    headerName: '❒',
    type: 'number',
    width: 60,
    disableColumnMenu: true,
  },
  {
    field: 'i',
    headerName: '✓i',
    type: 'number',
    width: 60,
    disableColumnMenu: true,
  },
  {
    field: 'e',
    headerName: '✓e',
    type: 'number',
    width: 60,
    disableColumnMenu: true,
  },
  {
    field: 'm',
    headerName: '✗',
    type: 'number',
    width: 60,
    disableColumnMenu: true,
  },
  {
    field: 'grade',
    headerName: 'Grade',
    width: 90,
    headerAlign: 'right',
    align: 'right',
    disableColumnMenu: true,
    valueGetter: (params) => {
      // return `${params.row.firstName || ''} ${params.row.lastName || ''}`
      // TODO calculate grade
      return `A+`
    },
  },
  {
    field: 'mvr',
    headerName: 'MVR',
    type: 'number',
    width: 90,
    disableColumnMenu: true,
  },
  {
    field: 'pp',
    headerName: 'P/V Points',
    type: 'number',
    width: 90,
    disableColumnMenu: true,
  },
  {
    field: 'tp',
    headerName: 'Points',
    type: 'number',
    width: 90,
    disableColumnMenu: true,
  },
];

export default function ValGroupStats() {
  const theme = useTheme();

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
        
        <Typography variant="h5">Val. Group 5</Typography>
        <Typography variant="subtitle2">-</Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">core assignments</Typography>
          <Typography variant="h5">38</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">backing votes</Typography>
          <Typography variant="h5">133</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">missed votes</Typography>
          <Typography variant="h5">133</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'}}>
          <Typography variant="caption">parachain</Typography>
          <Typography variant="h5">Karura</Typography>
        </Box>
    </Paper>
  );
}