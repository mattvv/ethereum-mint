import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const App = () => {
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();

  const requestAccount = () => {
    return window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getBalance = async () => {
    if (typeof window.ethereum === "undefined") {
      return;
    }

    const [account] = await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
    const balance = await contract.balanceOf(account);
    console.log("Balance: ", balance.toString());
  };

  const sendCoins = async () => {
    if (typeof window.ethereum === "undefined") {
      return;
    }

    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
    const transaction = await contract.transfer(userAccount, amount);
    await transaction.wait();
    console.log(`${amount} Coins successfully sent to ${userAccount}`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          onChange={(e) => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </header>
    </div>
  );
};

export default App;