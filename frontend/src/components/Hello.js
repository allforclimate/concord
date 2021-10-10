import { useWeb3React } from '@web3-react/core';

const Hello = () => {

    const { active, chainId, account, error } = useWeb3React();

    const register = () => {
        
        console.log("yo");
      };
    
    return (
        <div className="wallet-info">
          <p>Click on this button to register as a member of the DAO:</p>
          <button className="button-standard" onClick={register}>
          Register
        </button>
        </div>
      );
};

export default Hello;