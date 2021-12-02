import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks';
import connectorList, { resetWalletConnectConnector, setUserEmail } from '../lib/connectors';
import Modal from './Modal';
import useModal from './UseModal';

let email = "";
console.log("email2: ", email);

const ConnectWallet = () => {

  const [isConnecting, setIsConnecting] = useState(false);
  const { activate, deactivate, active, error } = useWeb3React();
  const { isShowing: isShowed, toggle: toggleModal } = useModal();

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  function setEmail(e) {
    email = e.target.value;
  }

  const handleClick = (connectorName) => () => {
    setIsConnecting(true);
    activate(connectorList[connectorName]);
  };

  const handleLogin = () => {
    console.log("email3: ", email);
    setUserEmail(email);
    toggleModal();
    setIsConnecting(true);
    activate(connectorList['MagicLink']);
  };

  const showModal = () => {
    toggleModal();
  };

  const handleDisconnect = () => {
    deactivate();
  };

  const handleRetry = () => {
    setIsConnecting(false);
    resetWalletConnectConnector(connectorList['WalletConnect']);
    deactivate();
  };

  useEffect(() => {
    if (active) {
      setIsConnecting(false);
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
          <button onClick={handleClick('MetaMask')} disabled={isConnecting}>
            Connect on MetaMask
          </button>
          <button className="btn button-magic" onClick={showModal} disabled={isConnecting}>
            Connect on MagicLink
          </button>
          <button onClick={handleClick('Portis')} disabled={isConnecting}>
            Connect on Portis
          </button>
          <button onClick={handleClick('WalletConnect')} disabled={isConnecting}>
            Connect on WalletConnect
          </button>
          <button onClick={handleClick('WalletLink')} disabled={isConnecting}>
            Connect on WalletLink
          </button>
        </>
      )}
      {!active && error && <button onClick={handleRetry}>Retry</button>}
      
      <Modal isShowing={isShowed} hide={toggleModal} >
             <input className="email-input" type="email" name="email" required="required" placeholder="me@email.com" onChange={setEmail} />
            <div><button className="button-standard" onClick={handleLogin} type="submit">Send</button>
            <button className="button-standard" onClick={toggleModal}>Close</button></div>
      </Modal>

    </div>
  );
};

export default ConnectWallet;
