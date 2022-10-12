import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import isUndefined from 'lodash/isUndefined'
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Identicon from '@polkadot/react-identicon';
import Tooltip from '@mui/material/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'
import { stashDisplay, nameDisplay } from '../util/display'
import {
  selectValProfileByAddress, 
  useGetValidatorProfileByAddressQuery,
} from '../features/api/valProfilesSlice';
import { 
  selectValidatorBySessionAndAddress,
 } from '../features/api/validatorsSlice'
 import {
  selectChainInfo
} from '../features/chain/chainSlice';
import { grade } from '../util/grade'
import { calculateMvr } from '../util/mvr'

export default function ValAddress({sessionIndex, address, showGrade}) {
  const theme = useTheme();
  const validator = useSelector(state => selectValidatorBySessionAndAddress(state, sessionIndex, address))

  const chainInfo = useSelector(selectChainInfo)

  if (isUndefined(chainInfo) || isUndefined(validator)) { 
    return null
  }

  const name = nameDisplay(!!validator.identity ? validator.identity : stashDisplay(address), 24);
  const gradeValue = !isUndefined(validator.para_summary) ? grade(1 - calculateMvr(validator.para_summary.ev, validator.para_summary.iv, validator.para_summary.mv)) : undefined;

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
            <Typography variant="caption"><FontAwesomeIcon style={{ marginRight: 8 }} icon={faWallet} />{address}</Typography>
          </Box>
        </Box>
        {showGrade && gradeValue ? 
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', 
                    bgcolor: theme.palette.grade[gradeValue], 
                    display: 'flex', justifyContent: 'center', alignItems: 'center'  }}>
            <Tooltip title={`Validator grade performance for the currennt session: ${gradeValue}`} arrow>
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