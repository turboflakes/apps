import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Identicon from '@polkadot/react-identicon';
import Tooltip from '@mui/material/Tooltip';
import {
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
} from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
} from '../features/api/sessionsSlice';
import {
  selectIdentityByAddress,
} from '../features/api/identitiesSlice';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'
import { stashDisplay, nameDisplay } from '../util/display'

export default function ValAddressHistory({address, maxSessions, showGrade}) {
  const theme = useTheme();
  const currentSession = useSelector(selectSessionCurrent);
  const historySessionIds = buildSessionIdsArrayHelper(currentSession, maxSessions).filter(session => session !== currentSession);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  const identity = useSelector(state => selectIdentityByAddress(state, address));

  if (!validators.length) { 
    return null
  }

  const filtered = validators.filter(v => v.is_auth && v.is_para);
  
  const mvr = calculateMvr(
    filtered.map(v => v.para_summary.ev).reduce((a, b) => a + b, 0),
    filtered.map(v => v.para_summary.iv).reduce((a, b) => a + b, 0),
    filtered.map(v => v.para_summary.mv).reduce((a, b) => a + b, 0)
  );

  const name = nameDisplay(!!identity ? identity : stashDisplay(address), 24);
  const gradeValue = grade(1 - mvr);

  return (
    <Paper
      sx={{
        p: 2,
        // m: 2,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: 112,
        borderRadius: 3,
        boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
      }}
      >
      <Box sx={{ display: "flex", height: '100%', justifyContent: 'space-between'}}>
        <Box sx={{ display: "flex", alignItems: 'center'}}>
          <Identicon style={{marginRight: '16px'}}
            value={address}
            size={64}
            theme={'polkadot'} />
          <Box>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="subtitle">{stashDisplay(address)}</Typography>
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
    </Paper>
  );
}