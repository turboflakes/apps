import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams
} from "react-router-dom";
import { ApiPromise, WsProvider } from '@polkadot/api';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getNetworkExternalWSS } from './constants';
import LayoutPage from './components/LayoutPage'
import DashboardPage from './components/DashboardPage'
import OverviewPage from './components/OverviewPage'
import ValidatorPage from './components/ValidatorPage'
import UnderMaintenancePage from './components/UnderMaintenancePage'
import withTheme from './theme/withTheme'
import {
  selectChain,
} from './features/chain/chainSlice';
import {isNetworkSupported} from './constants'
import onetSVG from './assets/onet.svg';

function useWeb3Api(chain) {
  const [api, setApi] = React.useState(undefined);

  React.useEffect(() => {
    
    const createWeb3Api = async (provider) => {
      return await ApiPromise.create({ provider });
    }

    if (chain) {
      const wsProvider = new WsProvider(getNetworkExternalWSS(chain));
      createWeb3Api(wsProvider).then((api) => setApi(api));
    }
  }, [chain]);

  return [api];
}

const ValidateChain = () => {
  let { chainName } = useParams();
  if (isNetworkSupported(chainName)) {
    return (<Outlet />)
  }
  return (<Navigate to="/dashboard" />)
}

const App = () => {
  const selectedChain = useSelector(selectChain);
  const [api] = useWeb3Api(selectedChain);

  const matches = useMediaQuery('(max-width: 1440px)');

  if (matches) {
    return (
      <Box sx={{p: 2, display: "flex", justifyContent:"center", 
        alignItems: "center", height: "100vh", }}>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <img src={onetSVG} style={{ 
              margin: "32px",
              opacity: 0.1,
              width: 128,
              height: 128 }} alt={"ONE-T logo"} />
          <Typography variant="h6" color="secondary" align="center">Reach a BIGGER screen to get full experience :)</Typography>
        </Box>
      </Box>
    )
  }
  
  return (
      <Router>
        <Routes>
          {/* <Route path="/" element={<UnderMaintenancePage />} />
          <Route path="*" element={<Navigate to="/" />} /> */}
          <Route path="/" element={<LayoutPage api={api} />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="insights" element={<OverviewPage tab={0} />} />
            <Route path="parachains" element={<OverviewPage tab={1} />} />
            <Route path="val-groups" element={<OverviewPage tab={2} />} />
            <Route path="validator" element={<ValidatorPage />} >
              <Route path=":stash" element={<ValidatorPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
        {/* <Routes>
          <Route path="/" element={<LayoutPage api={api} />}>
            <Route index element={<Navigate to="/one-t/kusama/dashboard" />} />
            <Route path="one-t">
              <Route index element={<Navigate to="/one-t/kusama/dashboard" />} />
              <Route path=":chainName" element={<ValidateChain />} >
                <Route index element={<Navigate to="/one-t/kusama/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="parachains">
                  <Route path="overview" element={<ParachainsOverviewPage tab={0} />} />
                  <Route path="val-groups" element={<ParachainsOverviewPage tab={1} />} />
                </Route>
                <Route path="validator" element={<ValidatorPage />} >
                  <Route path=":stash" element={<ValidatorPage />} />
                </Route>
                <Route path="validators" element={<InsightsPage />}>
                  <Route path="insights" element={<InsightsPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/one-t/kusama/dashboard" />} />
          </Route>
        </Routes> */}
      </Router>
  );
}

export default withTheme(App);
