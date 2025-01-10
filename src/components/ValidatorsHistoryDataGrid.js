import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { DataGrid } from '@mui/x-data-grid';
import Skeleton from '@mui/material/Skeleton';
import Identicon from '@polkadot/react-identicon';
import DetailsIcon from './DetailsIcon';
import GridIdentityLink from './GridIdentityLink';
import IdentityFilter from './IdentityFilter';
import InsightsInfoLegend from './InsightsInfoLegend';
import { gradeByRatios } from '../util/grade'
import {
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import { 
  selectSessionHistoryRangeIds,
} from '../features/api/sessionsSlice'
import {
  selectIdentityFilter,
  selectSubsetFilter,
} from '../features/layout/layoutSlice';
import {
  selectChainInfo
} from '../features/chain/chainSlice';
import { scoreDisplay, versionDisplay } from '../util/display';
import {
  chainAddress
} from '../util/crypto';

const defineColumns = (theme, chainInfo) => {
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
    width: 288,
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
      if (!isNull(params.row.mvr) && !isNull(params.row.bur)) {
        const gradeValue = gradeByRatios(params.row.mvr, params.row.bur);
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
    width: 80,
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
    field: 'authored_pts',
    headerName: 'Authored Points',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
    valueGetter: (params) => (!isNull(params.row.authored_blocks) ? params.row.authored_blocks * 20 : null),
  },
  {
    field: 'disputes',
    headerName: '↔',
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
    valueGetter: (params) => (!isNull(params.row.mvr) ? Math.round(params.row.mvr * 10000) / 10000 : null),
  },
  {
    field: 'availability',
    headerName: '✓ba',
    type: 'number',
    width: 64,
    disableColumnMenu: true,
  },
  {
    field: 'unavailability',
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
    valueGetter: (params) => (!isNull(params.row.bar) ? params.row.bar !== 0 ? params.row.bar.toFixed(4): 0 : null),
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
    sortingOrder: ['asc', 'desc'],
    valueGetter: (params) => (scoreDisplay(params.row.score)),
  },
  {
    field: 'node_version',
    headerName: 'Version',
    width: 80,
    headerAlign: 'right',
    align: 'right',
    disableColumnMenu: true,
    renderCell: (params) => {
      if (!isNull(params.row.node_version)) {
        const version = versionDisplay(params.row.node_version);
        return (<Box title={params.row.node_version}>{version}</Box>)
      } 
      return ('-')
    }
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
  const [showOnlyPV, setShowOnlyPV] = React.useState(true);
  // const [showAllGrades, setShowAllGrades] = React.useState(false);
  const [onlyDisputes, setOnlyDisputes] = React.useState(false);
  const [onlyLowGrades, setOnlyLowGrades] = React.useState(false);
  const chainInfo = useSelector(selectChainInfo);

  if (isUndefined(rows)) {
    return null
  }

  const rowsFiltered1 = showOnlyPV ? rows.filter(v => !isNull(v.mvr)) : rows;
  // const rowsFiltered2 = showAllGrades ? rowsFiltered1 : rowsFiltered1.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) !== 'F' : false);
  const rowsFiltered3 = onlyDisputes ? rows.filter(v => v.disputes > 0) : rowsFiltered1;
  const rowsFiltered4 = onlyLowGrades ? rows.filter(v => !isNull(v.mvr) && !isNull(v.bur) ? gradeByRatios(v.mvr, v.bur) === 'F' : false) : rowsFiltered3;
  const gradeFsCounter = rowsFiltered1.filter((v) => !isNull(v.mvr) && !isNull(v.bur) ? gradeByRatios(v.mvr, v.bur) === 'F' : false).length;
  const disputesCounter = rows.filter(v => v.disputes > 0).length;

  const columns = disputesCounter > 0 ? defineColumns(theme, chainInfo) : defineColumns(theme, chainInfo).filter(c => c.field !== 'disputes');

  const handleOnlyPVChange = (event) => {
    setShowOnlyPV(event.target.checked);
  };

  // const handleViewAllGradesChange = (event) => {
  //   setShowAllGrades(event.target.checked);
  // };

  const handleOnlyDisputesChange = (event) => {
    setOnlyDisputes(event.target.checked);
  };

  const handleOnlyLowGradesChange = (event) => {
    setOnlyLowGrades(event.target.checked);
  };

  return (
    <Box
      sx={{
        // p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
        <Box sx={{position: 'relative', mb:2, display: 'flex', alignItems: 'center'}}>
          <IdentityFilter />
          <FormGroup sx={{ ml: 4, display: 'flex', flexDirection: 'row'}}>
            <FormControlLabel control={
              <Switch size="small" checked={showOnlyPV} onChange={handleOnlyPVChange} />
            } 
            label="Show only active para-validators" 
            sx={{
              '& .MuiFormControlLabel-label' : {
                ...theme.typography.caption
              }
            }}/>
            <FormControlLabel control={
              <Switch size="small" disabled={disputesCounter === 0} checked={onlyDisputes} 
                onChange={handleOnlyDisputesChange} />
            } 
            label="Show only disputes" 
            sx={{
              '& .MuiFormControlLabel-label' : {
                ...theme.typography.caption
              }
            }}/>
            <FormControlLabel control={
              <Switch size="small" disabled={gradeFsCounter === 0} checked={onlyLowGrades} 
                onChange={handleOnlyLowGradesChange} />
            } 
            label="Show only low grades" 
            sx={{
              '& .MuiFormControlLabel-label' : {
                ...theme.typography.caption
              }
            }}/>
            {/* <FormControlLabel control={
              <Switch size="small" disabled={gradeFsCounter === 0 || onlyDisputes || onlyLowGrades} checked={showAllGrades || onlyDisputes || onlyLowGrades} 
                onChange={handleViewAllGradesChange} />
            } 
            label="Show all grades" 
            sx={{
              '& .MuiFormControlLabel-label' : {
                ...theme.typography.caption
              }
            }}/> */}
          </FormGroup>
          <Box sx={{ position: 'absolute', top: 0, right: 0}}>
            <InsightsInfoLegend />
          </Box>
        </Box>
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
              pageSize: 17,
            },
            sorting: {
              sortModel: [{ field: 'score', sort: 'desc' }],
            },
          }}
          // onRowClick={handleOnRowClick}
          rows={rowsFiltered4}
          columns={columns}
          rowsPerPageOptions={[17]}
          pagination
          disableSelectionOnClick
        />
    </Box>
  );
}