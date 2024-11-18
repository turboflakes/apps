import * as React from 'react';
import { useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Identicon from '@polkadot/react-identicon';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import GradeIcon from './GradeIcon';
import tvpValid from '../assets/dn_valid.svg';
// import tvpInvalid from '../assets/tvp_invalid.svg';
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
import { stakeDisplay, stashDisplay, symbolDisplay } from '../util/display'
import {
  chainAddress
} from '../util/crypto';

export default function ValAddressProfile({address, maxSessions, showGrade, showSubset, showDark}) {
  const theme = useTheme();
  const {isSuccess, isFetching} = useGetValidatorProfileByAddressQuery(address)
  const isLiveMode = useSelector(selectIsLiveMode);
  const historySession = useSelector(selectSessionHistory);
  const currentSession = useSelector(selectSessionCurrent);
  const valProfile = useSelector(state => selectValProfileByAddress(state, address));
  const sessionIndex = isLiveMode ? currentSession : (!!historySession ? historySession : currentSession);
  const chainInfo = useSelector(selectChainInfo)

  if (isFetching || isUndefined(valProfile) || isUndefined(chainInfo)) {
    return (<Skeleton variant="rounded" sx={{
      width: '100%',
      height: 212,
      borderRadius: 3,
      // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      bgcolor: showDark ? theme.palette.background.secondary : theme.palette.background.primary
    }} />)
  }

  if (!isSuccess) {
    return null
  }
  
  return (
    <Box
      sx={{
        p: 3,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 664,
        height: 212,
        // borderRadius: 3,
        // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;'
        // boxShadow: 'rgba(69, 205, 233, 0.4) 5px 5px, rgba(69, 205, 233, 0.3) 10px 10px, rgba(69, 205, 233, 0.2) 15px 15px, rgba(69, 205, 233, 0.1) 20px 20px, rgba(69, 205, 233, 0.05) 25px 25px;'
        // boxShadow: 'rgba(11, 19, 16, 0.4) 5px 5px, rgba(11, 19, 16, 0.3) 10px 10px, rgba(11, 19, 16, 0.2) 15px 15px, rgba(11, 19, 16, 0.1) 20px 20px, rgba(11, 19, 16, 0.05) 25px 25px;'
      }}
      >
      <Box sx={{ display: "flex", height: '100%', justifyContent: 'space-between'}}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ mt: theme.spacing(1/2) }}>
            <Identicon style={{marginRight: theme.spacing(1)}}
              value={chainAddress(address, chainInfo.ss58Format)}
              size={24}
              theme={'polkadot'} />
          </Box>
          <Box>
            <Box sx={{ maxWidth: 556, minHeight: 56, display: 'flex', justifyContent: 'space-between'}}>
              <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                <Typography variant="h5" color={showDark ? theme.palette.text.secondary : theme.palette.text.primary}>{valProfile?.identity ? valProfile._identity : stashDisplay(chainAddress(address, chainInfo.ss58Format))}</Typography>
                <Typography variant="caption" color={showDark ? theme.palette.neutrals[200] : theme.palette.neutrals[300]}>
                  <FontAwesomeIcon style={{ marginRight: 8 }} icon={faWallet} />{chainAddress(address, chainInfo.ss58Format)}
                </Typography>
              </Box>
              {showSubset && valProfile.subset === "TVP" ? 
                <Box sx={{ }}>
                  <Tooltip title={`Decentralized Node (Cohort 1)`} arrow>
                    <img src={tvpValid} style={{ 
                        width: 48,
                        height: "auto" }} alt="Decentralized Node (Cohort 1)" />
                  </Tooltip>  
                </Box>
              : null}
            </Box>
            <Divider sx={{ my: 2,
              opacity: 0.25,
              height: '1px',
              borderTop: '0px solid rgba(0, 0, 0, 0.08)',
              borderBottom: 'none',
              backgroundColor: 'transparent',
              backgroundImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))'
              }} />
            <Box sx={{ display: 'flex', width: '100%'}}>
              <Box sx={{ mr: theme.spacing(2), display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                {showGrade ? 
                  <GradeIcon sessionIndex={sessionIndex} maxSessions={maxSessions} address={address} size={64} /> : null}
              </Box>
              <Box sx={{ mr: theme.spacing(2),  display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} gutterBottom
                  color={showDark ? theme.palette.neutrals[200] : theme.palette.neutrals[300]}>commission</Typography>
                <Box>
                  <Typography variant="h5" component="span"
                    color={showDark ? theme.palette.text.secondary : theme.palette.text.primary}>{valProfile._commission}</Typography>
                </Box>
              </Box>
              <Box sx={{ mr: theme.spacing(2), display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} gutterBottom
                  color={showDark ? theme.palette.neutrals[200] : theme.palette.neutrals[300]}>self stake</Typography>
                <Box>
                  <Typography variant="h5" component="span"
                    color={showDark ? theme.palette.text.secondary : theme.palette.text.primary}>{stakeDisplay(valProfile.own_stake, chainInfo, 4, true, true, true, {...theme.typography.h6})}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mr: theme.spacing(2), display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} gutterBottom
                  color={showDark ? theme.palette.neutrals[200] : theme.palette.neutrals[300]}>nominators</Typography>
                <Box>
                  <Typography variant="h5" component="span"
                    color={showDark ? theme.palette.text.secondary : theme.palette.text.primary}>{valProfile.nominators_counter}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                <Typography variant="caption" sx={{whiteSpace: 'nowrap'}} gutterBottom
                  color={showDark ? theme.palette.neutrals[200] : theme.palette.neutrals[300]}>nominators stake</Typography>
                <Box>
                  <Typography variant="h5" component="span"
                    color={showDark ? theme.palette.text.secondary : theme.palette.text.primary}>
                      {stakeDisplay(valProfile.nominators_stake, chainInfo, 4, true, true, true, {...theme.typography.h6})}
                  </Typography>
                </Box>
              </Box>
              {/* {showSubset && valProfile.subset === "TVP" ? 
                <Box sx={{ mr: 3, display: 'flex', flexDirection: 'column', alignItems: 'left'}}>
                  <Tooltip title={`TVP Member`} arrow>
                    <img src={tvpValid} style={{ 
                        width: 64,
                        height: "auto" }} alt="TVP Member" />
                  </Tooltip>  
                </Box>
              : null} */}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}