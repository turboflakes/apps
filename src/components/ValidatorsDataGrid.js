import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import isNull from 'lodash/isNull';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';
import { DataGrid } from '@mui/x-data-grid';
import Identicon from '@polkadot/react-identicon';
import DetailsIcon from './DetailsIcon';
import { grade } from '../util/grade'
import {
  useGetValidatorsQuery,
  selectValidatorsInsightsBySessions,
} from '../features/api/validatorsSlice'
import {
  addressChanged,
  selectChain,
  selectAddress
} from '../features/chain/chainSlice';
import {
  selectIdentityFilter,
  selectSubsetFilter,
  pageChanged,
} from '../features/layout/layoutSlice';
import { scoreDisplay } from '../util/display';
import { isChainSupported, getChainName } from '../constants'


const defineColumns = (theme, chain) => {
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
    width: 256,
    disableColumnMenu: true,
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
    field: 'subset',
    headerName: 'Subset',
    width: 96,
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
    sortingOrder: ['asc', 'desc'],
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
  const {isSuccess} = useGetValidatorsQuery({session: sessionIndex, role: "authority", show_summary: true, show_profile: true}, {refetchOnMountOrArgChange: true, skip});
  const rows = useSelector(state => selectValidatorsInsightsBySessions(state, [sessionIndex], false, identityFilter, subsetFilter));
  const [onlyPV, setOnlyPV] = React.useState(true);
  const [viewAllGrades, setViewAllGrades] = React.useState(false);
  
  if (isUndefined(rows) && !isSuccess) {
    return null
  }

  const columns = defineColumns(theme, selectedChain);

  const rowsFiltered1 = onlyPV ? rows.filter(v => !isNull(v.mvr)) : rows;
  const rowsFiltered2 = viewAllGrades ? rowsFiltered1 : rowsFiltered1.filter((v) => !isUndefined(v.mvr) ? grade(1-v.mvr) !== 'F' : false);
  const gradeFsCounter = rowsFiltered1.filter((v) => !isNull(v.mvr) ? grade(1-v.mvr) === 'F' : false).length;

  const handleOnlyPVChange = (event) => {
    setOnlyPV(event.target.checked);
  };

  const handleViewAllGradesChange = (event) => {
    setViewAllGrades(event.target.checked);
  };

  return (
    <Box
      sx={{
        p: 2,
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
          rows={rowsFiltered2}
          columns={columns}
          rowsPerPageOptions={[16]}
          pagination
          disableSelectionOnClick
        />
        <FormGroup sx={{ display: 'flex', flexDirection: 'row'}}>
          <FormControlLabel control={
            <Switch size="small" checked={onlyPV} onChange={handleOnlyPVChange} />
          } 
          label="Show only active para-validators" 
          sx={{
            '& .MuiFormControlLabel-label' : {
              ...theme.typography.caption
            }
          }}/>
          <FormControlLabel control={
            <Switch size="small" disabled={gradeFsCounter === 0} checked={viewAllGrades} onChange={handleViewAllGradesChange} />
          } 
          label="Show all grades" 
          sx={{
            '& .MuiFormControlLabel-label' : {
              ...theme.typography.caption
            }
          }}/>
          {/* {gradeFsCounter !== 0 ?
            <FormHelperText>Note: {gradeFsCounter} validators with grade <b>F</b> are hidden.</FormHelperText>
            : null} */}
        </FormGroup>
    </Box>
  );
}