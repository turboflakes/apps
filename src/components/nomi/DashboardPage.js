import * as React from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Container from '@mui/material/Container';
// import Link from '@mui/material/Link';
// import SessionPerformance600Timeline from '../SessionPerformance600Timeline';
// import NetTotalStakedBox from '../NetTotalStakedBox';
// import NetLastRewardBox from '../NetLastRewardBox';
// import HistoryErasMenu from '../HistoryErasMenu';
// import ValidatorsRankingBox from '../ValidatorsRankingBox';
// import PoolsValidatorsRankingBox from '../PoolsValidatorsRankingBox';
// import NetVerticalTabs from '../NetVerticalTabs';
// import GradesBox from '../GradesBox';
// import NetPoolHistoryBox from '../NetPoolHistoryBox';
// import onetSVG from '../../assets/onet.svg';
import { 
  selectSessionCurrent,
 } from '../../features/api/sessionsSlice'
import { 
  selectMaxHistorySessions,
} from '../../features/layout/layoutSlice'
import { 
  selectIsSocketConnected,
} from '../../features/api/socketSlice'
import {
  selectChain,
} from '../../features/chain/chainSlice';
import {
  getNetworkName, getNetworkURL
} from '../../constants'

const SKILLS = ["explorer", "indexer", "reporter", "nominator", "matrix", "rust"]

export default function DashboardPage() {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const selectedChain = useSelector(selectChain);
  const isSocketConnected = useSelector(selectIsSocketConnected);
  const maxHistorySessions = useSelector(selectMaxHistorySessions);
  const currentSession = useSelector(selectSessionCurrent);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (index === SKILLS.length - 1) {
        setIndex(0);  
      }
      setIndex(index => index + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, [index]);
  
  if (!isSocketConnected) {
    // TODO websocket/network disconnected page
    return (<Box sx={{ m: 2, minHeight: '100vh' }}></Box>)
  }

  return (
    <Box sx={{ mb: 10, display: 'flex', justifyContent: 'center'}}>
		NOMI
    </Box>
  );
}