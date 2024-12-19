import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { DataGrid } from '@mui/x-data-grid';
import Identicon from '@polkadot/react-identicon';
import DetailsIcon from './DetailsIcon';
import GridIdentityLink from './GridIdentityLink';
import IdentityFilter from './IdentityFilter';
import InsightsInfoLegend from './InsightsInfoLegend';
import { grade } from '../util/grade'
import {
  useGetValidatorsQuery,
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import {
  selectChain,
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  selectIdentityFilter,
  selectSubsetFilter,
} from '../features/layout/layoutSlice';
import { scoreDisplay, versionDisplay } from '../util/display';
import { isChainSupported, getChainName } from '../constants'
import {
  chainAddress
} from '../util/crypto';

const defineColumns = (theme, chain, chainInfo) => {
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
    headerAlign: 'left',
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
    field: 'node_version',
    headerName: 'Version',
    width: 72,
    headerAlign: 'left',
    align: 'left',
    sortable: true,
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
    field: 'subset',
    headerName: 'Subset',
    width: 80,
    headerAlign: 'left',
    align: 'left',
    sortable: false,
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
    field: 'paraId',
    headerName: 'Backing Parachain',
    width: 128,
    disableColumnMenu: true,
    valueGetter: (params) => (!isNull(params.row.paraId) ? (isChainSupported(chain, params.row.paraId) ? getChainName(chain, params.row.paraId) : params.row.paraId) : null),
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
    headerName: 'Backing Points',
    type: 'number',
    width: 128,
    disableColumnMenu: true,
    valueGetter: (params) => (!isNull(params.row.avg_pts) ? Math.round(params.row.avg_pts) : null),
  },
  {
    field: 'score',
    headerName: 'Score',
    type: 'number',
    width: 96,
    disableColumnMenu: true,
    // sortingOrder: ['asc', 'desc'],
    valueGetter: (params) => (scoreDisplay(params.row.score)),
  },
  {
    field: 'options',
    headerName: '', 
    width: 72,
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

export default function ValidatorsDataGrid({sessionIndex, skip}) {
  const theme = useTheme();
  const selectedChain = useSelector(selectChain);
  const identityFilter = useSelector(selectIdentityFilter);
  const subsetFilter = useSelector(selectSubsetFilter);
  const {isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "authority", show_summary: true, show_profile: true, show_discovery: true}, {refetchOnMountOrArgChange: true, skip});
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, [sessionIndex], false, identityFilter, subsetFilter));
  const [showOnlyPV, setShowOnlyPV] = React.useState(true);
  // const [showAllGrades, setShowAllGrades] = React.useState(false);
  const [onlyDisputes, setOnlyDisputes] = React.useState(false);
  const [onlyLowGrades, setOnlyLowGrades] = React.useState(false);
  const chainInfo = useSelector(selectChainInfo)

  if (isUndefined(rows) && !isSuccess) {
    return null
  }

  const rowsFiltered1 = showOnlyPV ? rows.filter(v => !isNull(v.mvr)) : rows;
  // const rowsFiltered2 = showAllGrades ? rowsFiltered1 : rowsFiltered1.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) !== 'F' : false);
  const rowsFiltered3 = onlyDisputes ? rows.filter(v => v.disputes > 0) : rowsFiltered1;
  const rowsFiltered4 = onlyLowGrades ? rows.filter(v => !isNull(v.mvr) ? grade(1-v.mvr) === 'F' : false) : rowsFiltered3;
  const gradeFsCounter = rowsFiltered1.filter(v => !isNull(v.mvr) ? grade(1-v.mvr) === 'F' : false).length;
  const disputesCounter = rows.filter(v => v.disputes > 0).length;

  const columns = disputesCounter > 0 ? 
    defineColumns(theme, selectedChain, chainInfo): defineColumns(theme, selectedChain, chainInfo).filter(c => c.field !== 'disputes');
  
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

  console.log("__rowsFiltered4", rowsFiltered4);
  

  return (
    <Box
      sx={{
        // p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
        // height: '2768px',
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
              pageSize: 16,
            },
            sorting: {
              sortModel: [{ field: 'score', sort: 'desc' }],
            },
          }}
          // onRowClick={handleOnRowClick}
          rows={rowsFiltered4}
          columns={columns}
          rowsPerPageOptions={[16]}
          pagination
          disableSelectionOnClick
        />
    </Box>
  );
}