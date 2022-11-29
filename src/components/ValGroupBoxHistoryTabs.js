import * as React from 'react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import isUndefined from 'lodash/isUndefined'
// import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ValGroupBox from './ValGroupBox';
import { 
  useGetValidatorsQuery,
  selectValidatorsByAddressAndSessions,
  buildSessionIdsArrayHelper
 } from '../features/api/validatorsSlice';
import {
  selectSessionCurrent,
  selectSessionHistory,
  sessionHistoryChanged
} from '../features/api/sessionsSlice';
import {
  pageChanged,
} from '../features/layout/layoutSlice';
// import {
//   selectChain,
// } from '../features/chain/chainSlice';

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function useSessionIndex(historySession) {
  const [value, setValue] = React.useState(historySession);
  
  React.useEffect(() => {
    if (value !== historySession) {
      setValue(historySession);
    }
  }, [historySession]);

  return [value, setValue];
}

export default function ValGroupBoxHistoryTabs({address, maxSessions}) {
	// const theme = useTheme();
  const navigate = useNavigate();
	const dispatch = useDispatch();
  const currentSession = useSelector(selectSessionCurrent);
  const historySession = useSelector(selectSessionHistory);
  // const selectedChain = useSelector(selectChain);
  const historySessionIds = buildSessionIdsArrayHelper(currentSession - 1 , maxSessions);
  const validators = useSelector(state => selectValidatorsByAddressAndSessions(state, address, historySessionIds, true));
  const [sessionIndex, setSessionIndex] = useSessionIndex(historySession);

  const sessions = validators.filter(v => v.is_auth && v.is_para).map(v => v.session);
  
  if (sessions.length === 0) {
    return null
  }
  const handleChange = (event, index) => {
    setSessionIndex(index);
    if (!isUndefined(index) && historySession !== index) {
      setTimeout(() => dispatch(sessionHistoryChanged(index)), 50);
    }
  };

  return (
		<Box sx={{ my: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Stack spacing={3} direction="row" sx={{ mb: 1 }} alignItems="center">
          <Typography variant="caption" sx={{ ml: 2 }}><b>sessions</b></Typography>
          <Tabs textColor="inherit" sx={{ 
            '.MuiTabs-indicator': { display: 'none' }, 
            '& .Mui-selected': { 
              bgcolor: 'rgba(11, 19, 23, 0.08)',
              color: '#0B1317'
            }}} 
            value={sessionIndex} onChange={handleChange} aria-label="Parachains" 
            variant="scrollable" scrollButtons={false} allowScrollButtonsMobile>
              {sessions.map(session => 
                (<Tab key={session} 
                  sx={{ '.MuiButtonBase-root&.MuiTab-root': { minWidth: 0}, my:1, mr: 1/2, borderRadius: 3 }}
                  value={session} label={session} {...a11yProps(session)} disableRipple disableFocusRipple />)    
              )}
          </Tabs>
        
        </Stack>
      </Box>
      <ValGroupBox address={address} sessionIndex={sessionIndex} />
		</Box>
  );
}