import { useWeb3React } from '@web3-react/core';

const WalletInfo = () => {
  const { active, chainId, account, error } = useWeb3React();

  return (
    <div className="wallet-info">
      <h1>Kiez DAO interface</h1>
      <p>Active: {active.toString()}</p>
      {active && (
        <div>
          <p>Your wallet address: <strong>{account}</strong></p>
          <p>Network: {chainId}</p>
        </div>
      )}
      {error && <p className="text-error">error: {error.message}</p>}
    </div>
  );
};

export default WalletInfo;
