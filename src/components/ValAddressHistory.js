import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Identicon from '@polkadot/react-identicon';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import tvpValid from '../assets/tvp_valid.svg';
import tvpInvalid from '../assets/tvp_invalid.svg';
import {
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress, 
  useGetValidatorProfileByAddressQuery,
} from '../features/api/valProfilesSlice';
import {
  selectChainInfo
} from '../features/chain/chainSlice';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'
import { stakeDisplay } from '../util/display'

export default function ValAddressHistory({address, maxSessions, showGrade}) {
  const theme = useTheme();
  const {isSuccess} = useGetValidatorProfileByAddressQuery(address)
  const currentSession = useSelector(selectSessionCurrent);
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1, maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const chainInfo = useSelector(selectChainInfo)

  if (!isSuccess || isUndefined(chainInfo)) {
    return null
  }

  if (!validators.length) { 
    return null
  }

  const filtered = validators.filter(v => v.is_auth && v.is_para);
  
  const mvr = calculateMvr(
    filtered.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0),
    filtered.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0),
    filtered.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0)
  );

  const gradeValue = grade(1 - mvr);

  return (
    <Paper
      sx={{
        p: 3,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 256,
        borderRadius: 3,
        // backgroundColor: theme.palette.neutrals[300],
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
      <Box sx={{ display: "flex", height: '100%', justifyContent: 'space-between'}}>
        <Box sx={{ display: "flex" }}>
          <Identicon style={{marginRight: '16px'}}
            value={address}
            size={64}
            theme={'polkadot'} />
          <Box>
            <Typography variant="h5">{valProfile._identity}</Typography>
            <Typography variant="subtitle"><FontAwesomeIcon style={{ marginRight: 8 }} icon={faWallet} />{address}</Typography>
            <Divider sx={{ my: 2,
              opacity: 0.25,
              height: '1px',
              borderTop: '0px solid rgba(0, 0, 0, 0.08)',
              borderBottom: 'none',
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
              }} />
            <Box sx={{ display: 'flex'}}>
              <Box sx={{ mr: 3,  display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} gutterBottom>Commission</Typography>
                <Box>
                  <Typography variant="h5" component="span">{valProfile._commission}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} gutterBottom>Bonded</Typography>
                <Box>
                  <Typography variant="h5" component="span">{stakeDisplay(valProfile.own_stake, chainInfo)}</Typography>
                </Box>
              </Box>
              <Box>
                <img src={tvpValid} style={{ 
                    width: 80,
                    height: 80 }} alt={"tvp"}/>
              </Box>
            </Box>
          </Box>
        </Box>
        {showGrade && gradeValue ? 
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', 
                    bgcolor: theme.palette.grade[gradeValue], 
                    display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
            <Tooltip title={`Validator grade obtained in the last ${filtered.length} p/v sessions: ${gradeValue}`} arrow>
              <Box sx={{ width: 72, height: 72, borderRadius: '50%', 
                    bgcolor: "#fff", 
                    display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
                <Typography variant="h4">{gradeValue}</Typography>
              </Box>
            </Tooltip>
          </Box>
          : null}        
      </Box>
      {/* <Grid container spacing={0}>
        <Grid item xs={6} md={3}>
          <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
            <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Commission</Typography>
            <Box>
              <Typography variant="h5" component="span">3</Typography>
              <Typography component="span" variant="caption" sx={{m: 1, verticalAlign: "top"}}>%</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
            <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Bonded</Typography>
            <Box>
              <Typography variant="h5" component="span">101</Typography>
              <Typography component="span" variant="caption" sx={{m: 1, verticalAlign: "top"}}>KSM</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
            <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Commission</Typography>
            <Box>
              <Typography variant="h5" component="span">3</Typography>
              <Typography component="span" variant="caption" sx={{m: 1, verticalAlign: "top"}}>%</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box sx={{ px: 1, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
            <Typography variant="caption" sx={{whiteSpace: 'nowrap'}}>Bonded</Typography>
            <Box>
              <Typography variant="h5" component="span">101</Typography>
              <Typography component="span" variant="caption" sx={{m: 1, verticalAlign: "top"}}>KSM</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid> */}
    </Paper>
  );
}