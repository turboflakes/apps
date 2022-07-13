import React from 'react';
import { useSelector } from 'react-redux';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Layout } from '../Layout'
import { Dashboard } from '../Dashboard'
import { ValPerformancePage } from '../ValPerformancePage'
import { ValGroupsPage } from '../ValGroupsPage'
import { Body } from '../Body'
import { getNetworkExternalWSS } from '../../constants'
import {
  selectChain,
} from '../../features/chain/chainSlice';
import {
  selectPage
} from '../../features/layout/layoutSlice';


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

export const IndexPage = (props) => {
  const selectedChain = useSelector(selectChain);
  const selectedPage = useSelector(selectPage);
  const [api] = useWeb3Api(selectedChain);
  
  // if (!api) {
  //   return (<Loading />)
  // } else {
    return (
      <React.Fragment>
        <Layout api={api}>
          {
            selectedPage === 'dashboard' ?
              <Dashboard api={api} /> : (
                selectedPage === 'val-performance' ? 
                <ValPerformancePage /> : (
                  selectedPage === 'val-performance' ? 
                  <ValGroupsPage /> :
                <Body api={api} />)
                )
          }
        </Layout>
        {/* <Footer /> */}
        {/* <ScrollTop {...props}>
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop> */}
      </React.Fragment>
    )
  }
// }
