import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Identicon from '@polkadot/react-identicon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import GradeIcon from './GradeIcon';
import GradeHistoryIcon from './GradeHistoryIcon';
import tvpValid from '../assets/tvp_valid.svg';
import tvpInvalid from '../assets/tvp_invalid.svg';
import {
  selectSessionCurrent,
  selectSessionHistory
} from '../features/api/sessionsSlice';
import {
  selectValProfileByAddress, 
  useGetValidatorProfileByAddressQuery,
} from '../features/api/valProfilesSlice';
import {
  selectChainInfo
} from '../features/chain/chainSlice';
import {
  selectIsLiveMode
} from '../features/layout/layoutSlice';
import { stakeDisplay } from '../util/display'

export default function ValAddressProfile({address, maxSessions, showGrade}) {
  const theme = useTheme();
  const {isSuccess} = useGetValidatorProfileByAddressQuery(address)
  const isLiveMode = useSelector(selectIsLiveMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  const chainInfo = useSelector(selectChainInfo)

  if (!isSuccess || isUndefined(chainInfo)) {
    return null
  }
  
  return (
    <Paper
      sx={{
        p: 3,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 208,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'
        // boxShadow: 'rgba(69, 205, 233, 0.4) 5px 5px, rgba(69, 205, 233, 0.3) 10px 10px, rgba(69, 205, 233, 0.2) 15px 15px, rgba(69, 205, 233, 0.1) 20px 20px, rgba(69, 205, 233, 0.05) 25px 25px;'
        // boxShadow: 'rgba(11, 19, 16, 0.4) 5px 5px, rgba(11, 19, 16, 0.3) 10px 10px, rgba(11, 19, 16, 0.2) 15px 15px, rgba(11, 19, 16, 0.1) 20px 20px, rgba(11, 19, 16, 0.05) 25px 25px;'
      }}
      >
      <Box sx={{ display: "flex", height: '100%', justifyContent: 'space-between'}}>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Identicon style={{marginRight: '16px'}}
              value={address}
              size={64}
              theme={'polkadot'} />
          </Box>
          <Box>
            <Typography variant="h5">{valProfile._identity}</Typography>
            <Typography variant="caption"><FontAwesomeIcon style={{ marginRight: 8 }} icon={faWallet} />{address}</Typography>
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
            </Box>
          </Box>
          {showGrade ? (
            isLiveMode ? 
              <GradeIcon sessionIndex={sessionIndex} address={address} /> :
              <GradeHistoryIcon address={address} maxSessions={maxSessions} />
            )
           : null}
          <Box sx={{ ml: 2 }}>
            <img src={tvpValid} style={{ 
                width: 64,
                height: 64 }} alt={"tvp"}/>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}