import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks';
import connectorList, { resetWalletConnectConnector } from '../lib/connectors';
import Modal from './Modal';
import useModal from './UseModal';

let UserEmailAddress = "";

const ConnectWallet = () => {

  const [isConnecting, setIsConnecting] = useState(false);
  const [email, setEmail] = useState('one');
  const { activate, deactivate, active, error } = useWeb3React();
  const { isShowing: isShowed, toggle: toggleModal } = useModal();

  console.log("email2: ", email.UserEmailAddress);
  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  function setEmailAddress(e) {
    UserEmailAddress = e.target.value;
    // const email = UserEmailAddress;
    setEmail({UserEmailAddress});
    console.log("UserEmailAddress: ", UserEmailAddress);
  }

  const handleClick = (connectorName) => () => {
    console.log("click: ", UserEmailAddress);
    setIsConnecting(true);
    activate(connectorList[connectorName]);

  };

  const handleLogin = () => {
    // e.preventDefault();
    // email = new FormData(e.target).get("email");
    console.log("handlelogin: ", UserEmailAddress);
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
      <p>Your email address, please: </p>
             <input type="email" name="UserEmailAddress" required="required" placeholder="Enter your email" onChange={setEmailAddress} />
            <div><button className="button-standard" onClick={handleLogin} type="submit">Send</button></div>
            <div><button className="button-standard" onClick={toggleModal}>Close</button></div>
      </Modal>
    </div>
  );
};

export default ConnectWallet;
