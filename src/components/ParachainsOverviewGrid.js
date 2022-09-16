import * as React from 'react';
import { useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ParachainCard from './ParachainCard';
import { 
  useGetParachainsQuery,
 } from '../features/api/parachainsSlice'
import { 
  selectParachainIdsBySession,
} from '../features/api/sessionsSlice' 


export default function ParachainsOverviewGrid({sessionIndex}) {
	// const theme = useTheme();
  const {isSuccess} = useGetParachainsQuery({session: sessionIndex}, {refetchOnMountOrArgChange: true});
  const paraIds = useSelector(state => selectParachainIdsBySession(state, sessionIndex));

  if (!isSuccess) {
    return null
  }
  
  return (
		<Box sx={{ m: 0 }}>
      <Box
        sx={{
          p: 2,
          // m: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 120,
          // borderRadius: 3,
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
        }}
        >
        <Box sx={{ display: 'flex', justifyContent: 'space-between'}}>
          <Box>
            <Typography variant="h4">Parachains</Typography>
            <Typography variant="subtitle">Attestations of Validity by Parachain</Typography>
          </Box>
          {/* <Box>
            <Paper sx={{ p: 2, width: 176, borderRadius: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
              boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'}}>
              <Typography variant="caption">Parachains scheduled</Typography>
              <Typography variant="h5">{Object.keys(groupedByParaId).length}</Typography>
            </Paper>
          </Box> */}
        </Box>
      </Box>
      <Grid container spacing={2}>
        {paraIds.map(paraId => (
          <Grid item xs={12} md={3} key={paraId}>
            <ParachainCard sessionIndex={sessionIndex} paraId={paraId} />
          </Grid>
        ))}
      </Grid>
		</Box>
  );
}