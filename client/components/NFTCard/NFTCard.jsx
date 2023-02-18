import Styles from "./NFTCard.module.css";
import {useRouter} from "next/router";

import Image from "next/image";

const NFTCard = ({nftData, btnText}) => {
  const {image, name, price, tokenId, tokenURI, owner, seller} = nftData;
  console.log("Image URL -->", image);
  console.log("tokenId --> ", tokenId)

  const router = useRouter();

  const openNFTPage = () =>  {
    router.push({
      pathname: "/nftPage",
      query: {
        id: tokenId
  }});
  }
  return (
    <div className={Styles.nftCard} onClick={openNFTPage}>
        <Image src={image} alt={name} className={Styles.nftCard_img} width={100} height={100} />
        <div className={Styles.nftCard_details_container}>
        <div className={Styles.nftCard_details_text}>
            <p>{name} #{tokenId}</p>
            <p className={Styles.nft_price}> {price} ETH</p>
        </div>
        <button className={Styles.buy_nft_btn}>{btnText}</button>
        </div>
    </div>
  )
}

export default NFTCard