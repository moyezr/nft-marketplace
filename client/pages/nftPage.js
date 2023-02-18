import Styles from "../styles/nftPage.module.css";
import Image from "next/image";
import {useMarketContext} from "../utils/NFTMarketplaceContext"
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { alien } from "../img";
import { isResSent } from "next/dist/shared/lib/utils";

const NFTPage = () => {
    const {currentAddress, fetchTokenForId, buyNFT, resellNFT} = useMarketContext();
    const [nft, setNft] = useState(null);
    const [buyNFTMsg, BuyNFTMsg] = useState("")
    const [isReselling, setIsReselling] = useState(false);
    const [resellPrice, setResellPrice] = useState("")


    const router = useRouter();

    const fetchItem = async (tokenId) => {
      console.log("query --> ", tokenId)

      const item = await fetchTokenForId(tokenId);
      return item;
    }
    useEffect(() => {
      const tokenId = router.query.id;
      fetchItem(tokenId).then((res) => {
        console.log("res", res)
        setNft(res);
        console.log("Current Address --> ", currentAddress);
        console.log("Owner  --> ", res.owner )
      });
    }, [])



    const resellHandler = async (e) => {
      setIsReselling(true)
    }


  return (
    <div className={Styles.nftPage_global_container}>
    {nft != null  ? (
      <div className={Styles.nft_container}>
            <div className={Styles.nft_img_container}>
            <Image alt='NFT image' className={Styles.nft_img} src={nft.image} width={100} height={100} />
            </div>
            <div className={Styles.nft_details_container}>
            <p className={Styles.nft_name}>{nft.name} #{nft.tokenId}</p>
            <p className={Styles.nft_price}>Price - {nft.price.toString()} ETH</p>
            <p className={Styles.nft_description}>{nft.description}</p>
            <p className={Styles.nft_owner}>{currentAddress === nft.owner ? ( <span>You are the Owner of this NFT</span> ) : <>Owned by: <span> {nft.owner}</span></> }</p>
            <p className={Styles.nft_owner}>Seller : <span>{nft.seller}</span> </p>
            <div className={Styles.btn_container}>
              {isReselling ? <input type="number" placeholder="Enter Resell Price" onChange={e => setResellPrice(e.target.value.toString())} className={Styles.resell_input} /> : null  }
            
            {currentAddress == nft.owner ? (
              <button className={Styles.nft_page_btn} onClick={(e) => {
                isReselling ? resellNFT(nft.tokenId, resellPrice) : resellHandler(e)
              }}>{isReselling && resellPrice <= 0 ? "👈 Enter Resale Price" : "Resell This NFT"}</button>
            ) : (
              <button className={Styles.nft_page_btn} onClick={async (e) =>{
                        e.target.disabled = true;
                        await buyNFT(router.query.id, nft.price)
                        e.target.disabled = false;
                        }
                        }>Buy This NFT</button>
            )
            }
            </div>
            
          
            </div> 
        </div>
    ) : (
      <p className={Styles.info_txt}>Fetching data for the NFT...Please Wait</p>
    )}
        
    </div>
  )
}
export default NFTPage;