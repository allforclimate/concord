import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';
import ccAddress from '../contracts/contractAddress.json';
import CC from '../contracts/CC.json';

const Claim = () => {

    // const inCC = CC;
    // console.log(inCC);

    const { account } = useWeb3React();

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const register = async () => {
        console.log(ccAddress.CC);
        console.log(account);

        const signer = provider.getSigner(0);
        const addr = ccAddress.CC;
        const abi = CC.abi;
        
        const cc = new Contract(addr, abi, signer);
        const call = await cc.register();
        console.log("tx hash: ", call.hash);
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

export default Claim;