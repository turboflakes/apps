import React from 'react';
import {
  ExtensionsProvider,
  ExtensionAccountsProvider,
} from '@polkadot-cloud/react/providers';
import App from './App'
import { getNetworkSS58Format } from './constants'
import { validateChain } from './features/chain/chainSlice';

export default function AppWithProviders() {
  const [activeAccount, setActiveAccount] = React.useState();
  const dappName = "Apps by Turboflakes";
  const chain = validateChain()
  const ss58 = getNetworkSS58Format(chain);
  
  return (
    <ExtensionsProvider>
      <ExtensionAccountsProvider
        dappName={dappName}
        network={chain}
        ss58={ss58}
        activeAccount={activeAccount}
        setActiveAccount={setActiveAccount}
      >
        <App />
      </ExtensionAccountsProvider>
    </ExtensionsProvider>
  );
}