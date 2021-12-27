import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { Body, Button, Header, Link, SuperButton } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";
import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

function WalletButton({ provider, loadWeb3Modal, logoutOfWeb3Modal }) {

  const [account, setAccount] = useState("");
  const [rendered, setRendered] = useState("");

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);

        const name = await provider.lookupAddress(accounts[0]);

        if (name) {
          setRendered(name);
        } else {
          setRendered(account.substring(0, 6) + "..." + account.substring(36));
        }
      } catch (err) {
        setAccount("");
        setRendered("");
        console.error(err);
      }
    }
    fetchAccount();
  }, [account, provider, setAccount, setRendered]);

  return (
    <Button
      onClick={() => {
        if (!provider) {
          loadWeb3Modal();
        } else {
          logoutOfWeb3Modal();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  
  const { loading, error, data } = useQuery(GET_TRANSFERS);
  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal();
  const [account, setAccount] = useState("");
  const [txBeingSent, setTxBeingSent] = useState(false);
  const [contractBalance, setContractBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userAccountBal, setUserAccountBal] = useState(0);
  const [ccTotalSupply, setCcTotalSupply] = useState(0);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    async function fetchAccount() {
      try {
        if (!provider) {
          return;
        }

        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
        
      } catch (err) {
        setAccount("");
        console.error(err);
      }
    }
    fetchAccount();

    async function fetchContractBalance() {

      try {
        
        const defaultProvider = getDefaultProvider(4);
        
        const concordBalance = await defaultProvider.getBalance(addresses.concord);      
        const concordBalanceFormatted = ethers.utils.formatEther(concordBalance);
        setContractBalance(concordBalanceFormatted);
        console.log("Contract ETH balance: ", concordBalanceFormatted);

        const concord = new Contract(addresses.concord, abis.concord, defaultProvider);
        const getTotalSupplyRaw = await concord.totalSupply();      
        const ccTotalSupply = ethers.utils.formatEther(getTotalSupplyRaw);

        setCcTotalSupply(ccTotalSupply);

      } catch (err) {
        console.error(err);
      }
    }
    fetchContractBalance();

    async function fetchUserBalance(account) {

      try {
        
        const defaultProvider = getDefaultProvider(4);

        const concord = new Contract(addresses.concord, abis.concord, defaultProvider);
        const userTokenBalance = await concord.balanceOf(account);
        const userTokenBalanceFormatted = ethers.utils.formatEther(userTokenBalance);

        setUserBalance(userTokenBalanceFormatted);

        const getUserBal = await concord.getAccountBalance(account);
        const userAccountBal = ethers.utils.formatEther(getUserBal);

        setUserAccountBal(userAccountBal);
        
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserBalance(account);
  // }, [account, userBalance, userAccountBal, contractBalance, provider, setAccount]);
  }, [account, userBalance, userAccountBal, contractBalance, ccTotalSupply, provider, setAccount]);

  async function donate() {

    try {

      console.log("amount: ", amount);
      
      setTxBeingSent(true);

      const signer = provider.getSigner(0);
      const concord = new Contract(addresses.concord, abis.concord, signer);

      const amountFormatted = ethers.utils.parseEther(amount);

      const giveTx = await concord.give({value: amountFormatted});

      const receipt = await giveTx.wait();

        if (receipt.status === 0) {
            throw new Error("Failed");
        }
      
    } catch (err) {
      console.error(err);
    } finally {
      setTxBeingSent(false);
      window.location.reload();
    }
  }  

  React.useEffect(() => {
    if (!loading && !error && data && data.transfers) {
      // console.log({ transfers: data.transfers });
    }
  }, [loading, error, data]);

  return (
    <div>
      <Header>
        <WalletButton provider={provider} loadWeb3Modal={loadWeb3Modal} logoutOfWeb3Modal={logoutOfWeb3Modal} />
      </Header>
      <Body>
        <p>
          Concord balance: {contractBalance} ETH
        </p>
        <p>
          As of today, there are {ccTotalSupply} CC tokens in circulation.
        </p>
        {txBeingSent === true &&
        <p>
          Thank you very much! 🙂
        </p>
        }

        <input onChange={(e)=> setAmount(e.target.value)} type="text" name="amountToDonate" style={{ marginBottom: "20px" }} />< br/>
        <SuperButton onClick={donate}>
          Donate
        </SuperButton>
        
        {userBalance > 0 &&
        <p>
          You have <strong>{userBalance}</strong> CC tokens in your wallet.
        </p>
        }
        {userAccountBal > 0 &&
        <p>
          You have <strong>{userAccountBal}</strong> CC in your account. < br/>
          <input type="text" name="amountToWithdraw" style={{ marginRight: "8px" }} />
          <SuperButton className="btn btn-primary btn-sm">
          Topup my account
        </SuperButton>
        </p>
        }
        <p><Link href="https://rinkeby.etherscan.io/address/0x014ebB0072bC69d928Dbb36755920D8F6a162d8b" style={{ marginTop: "8px" }}>See on Etherscan</Link></p>
      </Body>
    </div>
  );
}

export default App;