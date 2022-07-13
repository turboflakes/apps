import React from 'react'
import { useSelector } from 'react-redux';
import moment from 'moment'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Spinner } from '../../components/Spinner'
import { getNetworkName, getNetworkPoolId } from '../../constants'
import { useGetPoolsQuery } from '../api/poolSlice'
import {
  selectChain, selectChainInfo
} from '../chain/chainSlice';
import { Typography } from '@mui/material';


export const PoolsBox = () => {

  const { data, isFetching, isSuccess } = useGetPoolsQuery();
  const selectedChain = useSelector(selectChain);
  const selectedChainInfo = useSelector(selectChainInfo);
  const tokenSymbol = !!selectedChainInfo ? selectedChainInfo.tokenSymbol[0] : '';
  
  if (isFetching) {
    return (
      <section>
        <Spinner text="Loading..." />
      </section>
    )
  } else if (isSuccess) {

    const columns = [
      { 
        field: 'id', 
        headerName: 'Pool ID', 
        width: 104, 
        disableColumnMenu: true 
      },
      {
        field: 'metadata',
        headerName: '',
        sortable: false,
        width: 384,
        disableColumnMenu: true
      },
      {
        field: 'bonded',
        headerName: `Bonded in ${tokenSymbol}`,
        type: 'number',
        width: 192,
        disableColumnMenu: true 
      },
      {
        field: 'member_counter',
        headerName: 'Members',
        type: 'number',
        width: 128,
        disableColumnMenu: true 
      },
      {
        field: 'nominees_counter',
        headerName: 'Nominees',
        type: 'number',
        width: 128,
        disableColumnMenu: true 
      },
      {
        field: 'apr',
        headerName: 'APR (%)',
        type: 'number',
        width: 128,
        disableColumnMenu: true 
      },
    ];

    const onetColumns = [
      ...columns
    ]
    
    const onetRows = () => {
      if (!!data.pools) {
        return data.pools.filter(pool => (pool.id === parseInt(getNetworkPoolId(selectedChain, 0)) || 
          pool.id === parseInt(getNetworkPoolId(selectedChain, 1)))).map(pool => {
          return {
            id: pool.id,
            metadata: pool.metadata,
            bonded: parseInt(pool.bonded.replace(tokenSymbol, '').trim()),
            member_counter: pool.member_counter,
            nominees_counter: !!pool.nominees ? pool.nominees.nominees.length : 0,
            apr: !!pool.nominees ? Math.round(pool.nominees.apr * 10000)/100 : 0,
          }
        })
      }
      return []
    }

    const rows = () => {
      if (!!data.pools) {
        return data.pools.map((pool) => {
          return {
            id: pool.id,
            metadata: pool.metadata,
            bonded: parseInt(pool.bonded.replace(tokenSymbol, '').trim()),
            member_counter: pool.member_counter,
            nominees_counter: !!pool.nominees ? pool.nominees.nominees.length : 0,
            apr: !!pool.nominees ? Math.round(pool.nominees.apr * 10000)/100 : 0,
          }
        })
      }
      return []
    }

    const initialState = {
        sorting: {
          sortModel: [{ field: 'apr', sort: 'desc' }],
        }, 
    };

    const onetAPR = !!data.pools ? data.pools.filter(pool => 
      ( pool.id === parseInt(getNetworkPoolId(selectedChain, 0)) || 
        pool.id === parseInt(getNetworkPoolId(selectedChain, 1))))
        .map(pool => !!pool.nominees ? Math.round(pool.nominees.apr * 10000)/100 : 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0) / 2 : 0
    
    
    const allAPR = !!data.pools ? data.pools.map(pool => !!pool.nominees ? Math.round(pool.nominees.apr * 10000)/100 : 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0) / (data.pools.length) : 0
    
    return (
      <Box sx={{ mt: 8, width: '100%' }}>
        <Typography
								variant="h3"
								color="textSecondary"
								align="left"
								paragraph
					>{`ONE-T Nomination Pools with ${Math.round(onetAPR)}% APR`}</Typography>
        <Box sx={{ maxWidth: '85%' }}>
          <Typography color="textSecondary" gutterBottom>Every era, ONE-T calculates the average APR¹ of all nomination pools. On {`${getNetworkName(selectedChain)}`}, at the beginning of era {data.era}, All nomination pools display an average of {Math.round(allAPR)}% APR → ONE-T nomination pools presents you with an average of <b>{Math.round(onetAPR)}% APR</b>.</Typography>
          <Typography color="textSecondary" variant="body2" paragraph><i>¹ Annual percentage rate (APR) is the rate used to help you understand potential returns from your bonded stake. The Nomination Pool APR is based on the average APR of all the current pool nominees (validators) from the last 84 eras on {getNetworkName(selectedChain)}, minus the respective validators commission.</i></Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <Box sx={{ height: '628px', width: '100%',  
            '.MuiDataGrid-virtualScroller': {
              marginTop: '157px !important'
            }
            }}>
            <DataGrid
              classes={{
                columnHeaders: 'teste'
              }}
              sx={{ bgcolor: '#FFF', width: '100%', borderRadius: 2 }}
              rows={rows()}
              columns={columns}
              pageSize={8}
              rowsPerPageOptions={[8]}
              initialState={initialState}
              disableSelectionOnClick
            />
            </Box>
            <Box sx={{ height: '104px', width: '100%', position: 'absolute', top: '54px',
              '& .super-app-theme--row': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
                fontWeight: 'bold',
                fontSize: '0.925rem'
              }
              }}>
              <DataGrid
                sx={{ bgcolor: '#FFF', width: '100%', borderRadius: 0 }}
                getRowClassName={() => 'super-app-theme--row'}
                rows={onetRows()}
                columns={onetColumns}
                initialState={initialState}
                disableSelectionOnClick
                hideFooter
                headerHeight={0}
              />
          </Box>
        </Box>
        <Typography color="textSecondary" variant="caption">last data sync and APR calculation {moment.unix(data.ts).utc().format("DD/MM/YYYY HH:mm:ss (UTC)")}</Typography>
      </Box>
    )
  }
  return null
}
