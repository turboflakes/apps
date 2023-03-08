import React from 'react'
import moment from 'moment'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import { NomineesBox } from './NomineesBox';
import { Spinner } from '../../components/Spinner'
import { JoinDialog } from './JoinDialog'
import { useGetPoolQuery, useGetPoolNomineesQuery, useGetPoolNominationQuery } from '../api/poolSlice'

export const PoolBox = ({poolId, api, extra}) => {
  
  const { data: pool, isFetching: poolIsFetching, isSuccess: poolIsSuccess } = useGetPoolQuery(poolId)
  const { data: nominees, isSuccess: isSuccessNominees } = useGetPoolNomineesQuery(poolId)
  const { data: lastNomination, isSuccess: isSuccessLastNomination } = useGetPoolNominationQuery(poolId)

  let content
  if (poolIsFetching) {
    content = <Spinner text="Loading..." />
  } else if (poolIsSuccess) {
    content = (
      <Card sx={{ height: '100%', borderRadius: '16px' }} elevation={0}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ padding: '0', minHeight: '244px', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ marginBottom: '16px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{}}>
                  <Typography variant="subtitle2">
                    {pool.metadata}
                  </Typography>
                  <Typography variant="h3" component="h2">
                    Pool {poolId}
                  </Typography>
                </Box>
                <CardActions sx={{ alignItems: "center", justifyContent: "center"}}>
                  <JoinDialog poolId={poolId} poolMetadata={pool.metadata} api={api} />
                </CardActions>
              </Box>
              <Typography gutterBottom>
              The nomination for <i>Pool ID {poolId}</i> aims to run once a day. Is fully automated and strictly based on the best TVP validators performances of the last {isSuccessLastNomination && !!lastNomination.sessions_counter ? lastNomination.sessions_counter : 'X'} sessions. {extra ? <b>{extra}</b> : ''}
              {isSuccessNominees ? <span>Only the <b>Top {nominees.nominees.length}</b> are nominated for this pool.</span> : <b>Stay tuned. Nominations will be triggered soon :)</b>}
              </Typography>
            </Box>
            <Box display="flex">
              <Typography variant="caption" align="right" sx={{width: '100%'}} gutterBottom>
                latest data sync {moment.unix(pool.ts).utc().format("DD/MM/YYYY HH:mm:ss (UTC)")}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ padding: '8px 0 16px 0', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Box sx={{ paddingRight: '32px' }}>
                <Typography variant="h5">
                  {pool.member_counter}
                </Typography>
                <Typography variant='subtitle2'>
                  Members
                </Typography>
              </Box>
              <Box sx={{ paddingRight: '32px' }}>
                <Typography variant="h5">
                  {pool.bonded}
                </Typography>
                <Typography variant='subtitle2'>
                  Bonded
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4">
                {isSuccessNominees ? `${Math.round(nominees.apr * 10000) / 100}%` : '-'}
                </Typography>
                <Box display="flex" justifyContent="left" alignItems="center">
                  <Typography variant='subtitle2'>
                    APR
                  </Typography>
                  <Tooltip title={`Annual percentage rate (APR) is the rate used to help you understand potential returns from your bonded stake. The Nomination Pool APR is based on the average APR of all the current pool nominees (validators) from the last 84 eras on {getNetworkName(selectedChain)}, minus the respective validators commission.`}>
                    <InfoIcon fontSize="inherit" sx={{ml: 1}}/>
                  </Tooltip>
                </Box>
              </Box>
            </Box>
            <NomineesBox poolId={poolId} />
          </CardContent>
      </Card>
    )
  }

  return <section>{content}</section>
}
