import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { Body, Button, Header, Link, SuperButton, TopupButton } from "./components";
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
  const [topup, setTopup] = useState(0);

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

      const amountFormatted = ethers.utils.parseEther(amount);

      const signer = provider.getSigner(0);
      const concord = new Contract(addresses.concord, abis.concord, signer);
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

  async function topupAccount() {

    try {

      console.log("topup: ", topup);
      
      setTxBeingSent(true);

      const topupFormatted = ethers.utils.parseEther(topup);

      const signer = provider.getSigner(0);
      const concord = new Contract(addresses.concord, abis.concord, signer);
      const topupTx = await concord.topup(topupFormatted.toString());

      const receipt = await topupTx.wait();

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
          Processing... 😉
        </p>
        }
        <input onChange={(e)=> setAmount(e.target.value)} type="text" name="amountToDonate" style={{ marginBottom: "20px" }} />< br/>
        <SuperButton onClick={donate}>
          Donate
        </SuperButton>
        {userAccountBal > 0 &&
        <p>
          You have <strong>{userAccountBal}</strong> CC in your account. 
        </p>
        }
        {userBalance > 0 &&
        <p>
          You have <strong>{userBalance}</strong> CC tokens in your wallet.< br/>
          <input onChange={(e)=> setTopup(e.target.value)} type="text" name="amountToTopup" style={{ marginBottom: "20px" }} />
          <TopupButton onClick={topupAccount}>
          Topup my account
        </TopupButton>
        </p>
        }
        <p><Link href="https://rinkeby.etherscan.io/address/0x6D347962c362C8DDd9E0c4324756CeD5F4c15945" style={{ marginTop: "8px" }}>See on Etherscan</Link></p>
      </Body>
    </div>
  );
}

export default App;