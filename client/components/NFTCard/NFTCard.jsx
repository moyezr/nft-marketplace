import Styles from "./NFTCard.module.css";

import Image from "next/image";

const NFTCard = ({ nftData}) => {

  const {imageURL, name, price, tokenId} = nftData;
  return (
    <div className={Styles.nftCard}>
        <Image src={imageURL} className={Styles.nftCard_img} width={100} height={100} />
        <div className={Styles.nftCard_details}>
            <p>NFT #{tokenId}</p>
            <p>Price - {price} ETH</p>
        </div>
    </div>
  )
}

export default NFTCard