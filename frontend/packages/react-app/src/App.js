import { useQuery } from "@apollo/react-hooks";
import { Contract } from "@ethersproject/contracts";
import { getDefaultProvider } from "@ethersproject/providers";
import React, { useEffect, useState } from "react";
// import { ContractFactory } from 'ethers';
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
  const [balance, setBalance] = useState("?");
  const [registered, setRegistered] = useState(false);
  const [txBeingSent, setTxBeingSent] = useState(false);

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
  }, [account, provider, setAccount]);

  async function fetchBalance(account) {

    try {
      
      // Probably should get it from useWeb3Modal({})[0]
      const defaultProvider = getDefaultProvider(4);

      const ccToken = new Contract(addresses.cc, abis.CC, defaultProvider);
      const tokenBalance = await ccToken.balanceOf(account);
      const tokenBalanceFormatted = tokenBalance.toString() / 1000000000000000000;
      console.log({ tokenBalance: tokenBalanceFormatted });
      setBalance(tokenBalanceFormatted);
      
    } catch (err) {
      setBalance(0);
      console.error(err);
    }
  }
  
  async function register() {

    try {
      
      setTxBeingSent(true);

      const signer = provider.getSigner(0);
      const ccToken = new Contract(addresses.cc, abis.CC, signer);
      const RegisterTx = await ccToken.register();

      const receipt = await RegisterTx.wait();

        if (receipt.status === 0) {
            throw new Error("Failed");
        }

      setRegistered(true);
      
    } catch (err) {
      setRegistered(false);
      console.error(err);
    } finally {
      setTxBeingSent(false);
      fetchBalance(account);
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
          Your CC balance: {balance}
        </p>
        {txBeingSent === true &&
        <p>
          Processing...
        </p>
        }
        {registered === true &&
        <p>
          You're properly registered. Yay!
        </p>
        }

        <SuperButton onClick={() => fetchBalance(account)}>
          Check my balance
        </SuperButton>
        <SuperButton onClick={() => register()}>
          Register
        </SuperButton>
        <Link href="" style={{ marginTop: "8px" }}></Link>
      </Body>
    </div>
  );
}

export default App;
