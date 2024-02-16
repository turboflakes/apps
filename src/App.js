import React from 'react';
import { useSelector } from 'react-redux';
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
import UnderMaintenancePage from './components/UnderMaintenancePage'
// ONE-T Pages
import DashboardPage from './components/DashboardPage'
import OverviewPage from './components/OverviewPage'
import ValidatorPage from './components/ValidatorPage'
import PoolsOverviewPage from './components/PoolsOverviewPage'
// NOMI Pages
import NomiDashboardPage from './components/nomi/DashboardPage'
// TODO: (StakePage)
// import StakePage from './components/stake/StakePage'
import {
  selectBestBlock,
  selectFinalizedBlock,
} from './features/api/blocksSlice';
import withTheme from './theme/withTheme'
import {
  selectApp,
} from './features/app/appSlice';
import {
  selectChain,
} from './features/chain/chainSlice';
import {isNetworkSupported} from './constants'
import onetSVG from './assets/onet.svg';
import nomiSVG from './assets/nomi.svg';


function useWeb3Api(chain) {
  const [api, setApi] = React.useState();

  React.useEffect(() => {
    const createWeb3Api = async (provider) => {
      const api = await ApiPromise.create({ provider, noInitWarn: true, throwOnConnect: true })
      await api.isReady
      setApi(api)
    }
    
    if (chain) {
      const wsProvider = new WsProvider(getNetworkExternalWSS(chain));
      createWeb3Api(wsProvider).catch(console.error);
    }

    return function cleanup() {
      if (api) {
        api.disconnect();
      }
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
  const selectedApp = useSelector(selectApp);
  const selectedChain = useSelector(selectChain);
  const best_block = useSelector(selectBestBlock);
  const finalized_block = useSelector(selectFinalizedBlock);
  const [api] = useWeb3Api(selectedChain);

  const matches = useMediaQuery(selectedApp === "onet" ? '(max-width: 1440px)' : '(max-width: 1024px)');

  if (matches) {
    return (
      <Box sx={{p: 2, display: "flex", justifyContent:"center", 
        alignItems: "center", height: "100vh", }}>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        {selectedApp === "onet" ?
          <React.Fragment>
            <img src={onetSVG} style={{ 
                margin: "32px",
                opacity: 0.1,
                width: 128,
                height: 128 }} alt={"ONE-T"} />
            <Typography variant="h6" color="secondary" align="center">Reach a BIGGER screen to get full experience :)</Typography>
            <Typography variant="caption" color="secondary" align="center">ONE-T is currently optimized for screens with a width of 1440 pixels or greater.</Typography>
          </React.Fragment> : null }
        {selectedApp === "nomi" ?
          <React.Fragment>
            <img src={nomiSVG} style={{ 
                margin: "32px",
                opacity: 0.1,
                width: 128,
                height: 128 }} alt={"NOMI"} />
            <Typography variant="h6" color="secondary" align="center">Reach a BIGGER screen to get full experience :)</Typography>
            <Typography variant="caption" color="secondary" align="center">NOMI is currently optimized for screens with a width of 1024 pixels or greater.</Typography>
          </React.Fragment> : null }
        </Box>
      </Box>
    )
  }

  // Show under maintenance if indexer is syncing
  // TODO: it needs to be set as a flag from the indexer backend - disabled for now
  // if (best_block?.block_number - finalized_block?.block_number > 100) {
  //   return (
  //     <Router>
  //       <Routes>
  //         <Route path="/" element={<UnderMaintenancePage />} />
  //         <Route path="*" element={<Navigate to="/" />} />
  //       </Routes>
  //     </Router>
  //   )
  // }
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LayoutPage api={api} />}>
            {selectedApp === "onet" ?
              <React.Fragment>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="insights" element={<OverviewPage tab={0} />} />
                <Route path="parachains" element={<OverviewPage tab={1} />} />
                <Route path="val-groups" element={<OverviewPage tab={2} />} />
                {/* TODO: cores usage page
                  <Route path="cores" element={<OverviewPage tab={3} />} /> 
                */}
                <Route path="pools" element={<PoolsOverviewPage />} />
                <Route path="validator" element={<ValidatorPage />} >
                  <Route path=":stash" element={<ValidatorPage />} />
                </Route>
              </React.Fragment> : null }
            {selectedApp === "nomi" ?
              <React.Fragment>
                <Route index element={<Navigate to="/dashboard" />} />
                <Route path="dashboard" element={<NomiDashboardPage />} />
              </React.Fragment> : null }
            {/* <Route path="stake" >
              <Route path=":name" element={<StakePage />} />
            </Route> */}
          </Route>
        <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
  );
}

export default withTheme(App);
