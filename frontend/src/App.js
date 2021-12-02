import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import ConnectWallet from './components/ConnectWallet';
import WalletInfo from './components/WalletInfo';
import Claim from './components/Claim';

import './App.css';

const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
};

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="App">
        <WalletInfo />
        <ConnectWallet />
        <Claim />
      </div>
    </Web3ReactProvider>
  );
}

export default App;
