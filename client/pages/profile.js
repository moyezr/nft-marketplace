import Styles from "../styles/profile.module.css"
import { useState, useEffect } from "react"
import { NFTCard } from "../components/componentsIndex"
// import { alien, bat, frankenstein, threeEyes, pumpkin, greenZombie } from "../img"
import { useMarketContext } from "../utils/NFTMarketplaceContext"
const Profile = () => {

  // const ownedItems = [
  //   {
  //     image: alien,
  //     name: "Alien",
  //     price: "0.01",
  //     tokenId: 1
  //   }, {
  //     image: frankenstein,
  //     name: "Frankenstein",
  //     price: "0.04",
  //     tokenId: 2
  //   },
  //   {
  //     image: bat,
  //     name: "Bat",
  //     price: "0.03",
  //     tokenId: 3
  //   },
  
  // ]

  // const listedItems = [
  //   {
  //     image: threeEyes,
  //     name: "Three Eyes",
  //     price: "0.04",
  //     tokenId: 4
  //   },
  //   {
  //     image: pumpkin,
  //     name: "Pumpkin",
  //     price: "0.04",
  //     tokenId: 5
  //   },
  //   {
  //     image: greenZombie,
  //     name: "Green Zombie",
  //     price: "0.04",
  //     tokenId: 6
  //   },
  // ]

  const { currentAddress, fetchOwnedItems, fetchListedItems, walletConnected, connectWallet } = useMarketContext();
  const [viewOwned, setViewOwned] = useState(true);

  const [ownedItems, setOwnedItems] = useState([]);
  const [listedItems, setListedItems] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const onTabClickHandler = (e) => {
    const ownedNFTTab = document.querySelector(`#ownedTab`);
    const listedNFTTab = document.querySelector(`#listedTab`);

    if(e.target == ownedNFTTab) {
      setViewOwned(true);
      listedNFTTab.classList.remove(Styles.isOpened);
      ownedNFTTab.classList.add(Styles.isOpened)
    } else {
      setViewOwned(false);
      ownedNFTTab.classList.remove(Styles.isOpened);
      listedNFTTab.classList.add(Styles.isOpened)
    }  
  }

  const fetchOwnedNFTs = async () => {
    try {
      const items = await fetchOwnedItems(setDataFetched);
      console.log("Owned NFTS -->", items);
      setOwnedItems(items);
    } catch (error) {
      console.log("Error fetching owned NFTs in frontend", error)
    }
  }

  const fetchListedNFTs = async () => {
    try {
      const items = await fetchListedItems(setDataFetched);
      console.log("Listed Items --> ", items);
      setListedItems(items);
    } catch (error) {
      console.log("Error fetching listed NFTs in frontend", error)
    }
  }

  useEffect(() => {
    if(!walletConnected){
      connectWallet();
    }
    fetchOwnedNFTs();
    fetchListedNFTs();
  }, [currentAddress])

  return (
    <div className={Styles.profile_container}>
      <p className={Styles.profile_wallet_address}>{walletConnected > 0 ? ( <><span>Wallet Address : </span> {currentAddress} </> ):( <span>You are not Connected. Please Connect Your Wallet</span>)}</p>

        {walletConnected ? (
        <>
          <div className={Styles.profile_nfts_tabs_container}>
          <p id="ownedTab" onClick={onTabClickHandler} className={`${Styles.profile_nfts_tabs} ${Styles.isOpened}`} >Owned NFTs</p>
          <p id="listedTab" onClick={onTabClickHandler} className={`${Styles.profile_nfts_tabs}`} >Listed NFTs</p>
          </div>
          <div className={Styles.profile_nfts_container}>
              {
                dataFetched ? (
                  viewOwned ? (
                    ownedItems.length > 0 ? ( ownedItems.map((el) => <NFTCard nftData={el} btnText="Resell this NFT" />) ) : <p className={Styles.info_txt} >You don't own any NFTs😑</p>
                  ) : listedItems.length > 0 ? ( listedItems.map((el) => <NFTCard btnText="Buy This NFT" nftData={el} />) ) : <p className={Styles.info_txt} >You don't have any listed items😑</p>
                ) : <p className={Styles.info_txt} >Fetching NFT Data ... Please Wait😑</p>
              }
          </div>
        </>
        ): null 
        }        
        
    </div>
  )
}

export default Profile