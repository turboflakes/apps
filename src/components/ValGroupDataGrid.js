import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Identicon from '@polkadot/react-identicon';
import DetailsIcon from './DetailsIcon';
import GridIdentityLink from './GridIdentityLink';
import InsightsInfoLegend from './InsightsInfoLegend';
import { gradeByRatios } from '../util/grade';
import { calculateMVR, calculateBAR, calculateBUR } from '../util/math';
import {
  selectValidatorsBySessionAndGroupId
} from '../features/api/valGroupsSlice';
import {
  selectAddress,
  selectChainInfo
} from '../features/chain/chainSlice';
import { stashDisplay, nameDisplay, versionDisplay } from '../util/display';
import {
  chainAddress
} from '../util/crypto';

const defineColumns = (theme, chainInfo) => {
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
              value={chainAddress(params.row.address, chainInfo.ss58Format)}
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
    width: 240,
    disableColumnMenu: true,
    sortable: false,
    renderCell: (params) => {
      if (!params.row.address) {
        return null
      } 
      return (
        <GridIdentityLink address={params.row.address} />
      )
    }
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
      const mvr = calculateMVR(params.row.e, params.row.i, params.row.m)
      const bur = calculateBUR(params.row.ba, params.row.bu)
      const gradeValue = gradeByRatios(mvr, bur);
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
    field: 'nv',
    headerName: 'Version',
    width: 80,
    headerAlign: 'right',
    align: 'right',
    disableColumnMenu: true,
    renderCell: (params) => {
      if (!isNull(params.row.nv)) {
        const version = versionDisplay(params.row.nv);
        return (<Box title={params.row.nv}>{version}</Box>)
      } 
      return ('-')
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
    field: 'd',
    headerName: '↔',
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
    headerName: '✗v',
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
      return calculateMVR(params.row.e, params.row.i, params.row.m)
    },
  },
  {
    field: 'ba',
    headerName: '✓ba',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'bu',
    headerName: '✗bu',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'bar',
    headerName: 'BAR',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    valueGetter: (params) => {
      return calculateBAR(params.row.ba, params.row.bu)
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
    width: 64,
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

function createDataGridRows(id, identity, address, b, d, i, e, m, ba, bu, p, nv) {
  return {id, identity, address, b, d, i, e, m, ba, bu, p, nv};
}

export default function ValGroupDataGrid({sessionIndex, groupId}) {
  const theme = useTheme();
  const validators = useSelector(state => selectValidatorsBySessionAndGroupId(state, sessionIndex,  groupId));
  const selectedAddress = useSelector(selectAddress);
  const chainInfo = useSelector(selectChainInfo)
  if (!validators.length || validators.length !== validators.filter(v => !!v.para_stats).length) {
    return null
  }

  let sorted = validators.sort((a, b) => ((b.auth.ep - b.auth.sp) - (a.auth.ep - a.auth.sp)));

  const rows = sorted.map((v, i) => {
    if (v.is_auth && v.is_para) {
      const authored_blocks = v.auth.ab.length;
      const total_points = v.auth.ep - v.auth.sp;
      const node_version = v.discovery ? v.discovery.nv : "";
      
      return createDataGridRows(i+1, 
        nameDisplay(!!v.profile ? v.profile._identity : stashDisplay(v.address, 6), 36, selectedAddress === v.address ? '★ ' : ''), 
        v.address, 
        authored_blocks, 
        !isUndefined(v.para.disputes) ? v.para.disputes.length : 0,
        v.para_summary.iv, 
        v.para_summary.ev, 
        v.para_summary.mv, 
        v.para.bitfields?.ba, 
        v.para.bitfields?.bu, 
        total_points,
        node_version)
    } else {
      return createDataGridRows(i+1, '-', '', 0, 0, 0, 0, 0, 0, 0, 0, '-');
    }
  })
  const columns = defineColumns(theme, chainInfo);

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 128 + (rows.length * 52),
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Validators</Typography>
          <InsightsInfoLegend />
        </Box>
        <DataGrid
          sx={{ bgcolor: '#FFF', width: '100%', borderRadius: 0, border: 0 }}
          rows={rows}
          columns={columns}
          pageSize={6}
          rowsPerPageOptions={[6]}
          hideFooter
          disableSelectionOnClick
          disableRowSelectionOnClick
        />
    </Paper>
  );
}