import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { Body, Button, Header, Link, SuperButton } from "./components";
import useWeb3Modal from "./hooks/useWeb3Modal";

import { addresses, abis } from "@project/contracts";
import GET_TRANSFERS from "./graphql/subgraph";

// const contractBalance = 1;
// const give = 1;
//const donate = 1;
// const userBalance = 1; //

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
  const [give, setGive] = useState(false);

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
        
      } catch (err) {
        console.error(err);
      }
    }
    fetchContractBalance();

    async function fetchUserBalance(account) {

      try {
        
        // This is causing a weird error: "resolver or addr is not configured for ENS name"
        const defaultProvider = getDefaultProvider(4);
        const concord = new Contract(addresses.concord, abis.concord, defaultProvider);
        const userTokenBalance = await concord.balanceOf(account);
        const userTokenBalanceFormatted = ethers.utils.formatEther(userTokenBalance);
        setUserBalance(userTokenBalanceFormatted);
        
      } catch (err) {
        console.error(err);
      }
    }
    fetchUserBalance(account);
    
  }, [account, userBalance, contractBalance, provider, setAccount]);

  async function donate() {

    try {
      
      setTxBeingSent(true);

      const signer = provider.getSigner(0);
      const concord = new Contract(addresses.concord, abis.concord, signer);
      const giveTx = await concord.give({value: ethers.utils.parseEther("0.0000002")});

      const receipt = await giveTx.wait();

        if (receipt.status === 0) {
            throw new Error("Failed");
        }

      setGive(true);
      
    } catch (err) {
      setGive(false);
      console.error(err);
    } finally {
      setTxBeingSent(false);
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
        {txBeingSent === true &&
        <p>
          Processing...
        </p>
        }
        {give === true &&
        <p>
          Thank you very much! 🙂
        </p>
        }

        <SuperButton onClick={() => donate()}>
          Donate 0.0000002 ETH
        </SuperButton>
        {userBalance > 0 &&
        <p>
          You own {userBalance} CC tokens.
        </p>
        }
        <p><Link href="https://rinkeby.etherscan.io/address/0xD70294E4b40e7D9cEb16447Ebb41b90D02199EF5" style={{ marginTop: "8px" }}>See on Etherscan</Link></p>
      </Body>
    </div>
  );
}

export default App;