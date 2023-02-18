import Styles from "./ConnectButton.module.css";

import { useMarketContext } from "../../utils/NFTMarketplaceContext";
import { useEffect } from "react";
const ConnectButton = ({ className }) => {

  const { walletConnected, setCurrentAddress, currentAddress, connectWallet  } = useMarketContext();

  useEffect(() => {
    window.ethereum.on("accountsChanged",(newAccounts) => {
      console.log("Accounts Changed");
      connectWallet();
    });
  }, [currentAddress])


  return (
    <button onClick={() => {
      connectWallet();
    }} className={`${Styles.connect_btn} ${walletConnected ? Styles.connected_btn: null }`}>{ walletConnected ? `Connected To ${currentAddress.substr(0,12)}...${currentAddress.substr(35)}` : "Connect Wallet"}</button>
)
}

export default ConnectButton