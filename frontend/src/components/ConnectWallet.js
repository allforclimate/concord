import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks';
import connectorList, { resetWalletConnectConnector } from '../lib/connectors';
import ReactModal from 'react-modal';

<ReactModal

isOpen={
  false
/* Boolean describing if the modal should be shown or not. */}

>
  <p>Modal Content</p>
</ReactModal>

const ConnectWallet = () => {

  const [isConnecing, setIsConnecing] = useState(false);
  const { activate, deactivate, active, error } = useWeb3React();

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  const handleClick = (connectorName) => () => {
    setIsConnecing(true);
    activate(connectorList[connectorName]);
  };

  const handleDisconnect = () => {
    deactivate();
  };

  const handleRetry = () => {
    setIsConnecing(false);
    resetWalletConnectConnector(connectorList['WalletConnect']);
    deactivate();
  };

  useEffect(() => {
    if (active) {
      setIsConnecing(false);
    }
  }, [active]);

  return (
    <div className="connect-wallet">
      {active && (
        <button className="button-disconnect" onClick={handleDisconnect}>
          Disconnect Wallet
        </button>
      )}
      {!active && (
        <>
          <button onClick={handleClick('MetaMask')} disabled={isConnecing}>
            Connect on MetaMask
          </button>
          <button className="btn button-magic" onClick={handleClick('MagicLink')} disabled={isConnecing}>
            Connect on MagicLink
          </button>
          <button onClick={handleClick('Portis')} disabled={isConnecing}>
            Connect on Portis
          </button>
          <button onClick={handleClick('WalletConnect')} disabled={isConnecing}>
            Connect on WalletConnect
          </button>
          <button onClick={handleClick('WalletLink')} disabled={isConnecing}>
            Connect on WalletLink
          </button>
        </>
      )}
      {!active && error && <button onClick={handleRetry}>Retry</button>}
    </div>
  );
};

export default ConnectWallet;
