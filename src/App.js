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
import { getNetworkExternalWSS } from './constants';
import { LayoutPage } from './components/LayoutPage'
import { ParachainsOverviewPage } from './components/ParachainsOverviewPage'
import { ValGroupPage } from './components/ValGroupPage'
import withTheme from './theme/withTheme'
import {
  selectChain,
} from './features/chain/chainSlice';
import {isNetworkSupported} from './constants'

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
  return (<Navigate to="/one-t/kusama/parachains/overview" />)
}

const App = () => {
  const selectedChain = useSelector(selectChain);
  const [api] = useWeb3Api(selectedChain);
  
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LayoutPage api={api} />}>
            <Route index element={<Navigate to="/one-t/kusama/parachains/overview" />} />
            <Route path="one-t">
              <Route index element={<Navigate to="/one-t/kusama/parachains/overview" />} />
              <Route path=":chainName" element={<ValidateChain />}>
              <Route index element={<Navigate to="/one-t/kusama/parachains/overview" />} />
                <Route path="parachains">
                  <Route path="overview" element={<ParachainsOverviewPage tab={0} />} />
                  <Route path="val-groups" element={<ParachainsOverviewPage tab={1} />} />
                  <Route path="val-group" element={<ValGroupPage />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/one-t/kusama/parachains/overview" />} />
          </Route>
        </Routes>
      </Router>
  );
}

export default withTheme(App);
