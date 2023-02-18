import { useState } from "react";
import Image from "next/image";
import { useMarketContext } from "../utils/NFTMarketplaceContext";
import {greenZombie} from "../img"
import Styles from "../styles/listNFT.module.css";
const ListNFT = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const { listNFT, message } = useMarketContext();

  const onChangeHandler = (e, setter) => {
    setter(e.target.value);
  };

  return (
    <div className={Styles.listNFT_container}>
      <p className={Styles.listNFT_heading}>
        Upload Your NFT To the Marketplace
      </p>

      <form className={Styles.form_container}>
        <div className={Styles.form_inputs_container}>
          <div className={Styles.input_container}>
            <label className={Styles.input_label} htmlFor="name">
              NFT Name
            </label>
            <input
              id="name"
              className={Styles.input}
              onChange={(e) => onChangeHandler(e, setName)}
            />
          </div>
          <div className={Styles.input_container}>
            <label className={Styles.input_label} htmlFor="description">
              NFT Description
            </label>
            <input
              id="description"
              className={Styles.input}
              onChange={(e) => onChangeHandler(e, setDescription)}
            />
          </div>
          <div className={Styles.input_container}>
            <label htmlFor="price" className={Styles.input_label}>
              NFT Price (in ETH)
            </label>
            <input
              id="price"
              className={Styles.input}
              onChange={(e) => onChangeHandler(e, setPrice)}
            />
          </div>
          <div className={Styles.input_container}>
            <button type="submit" onClick={async (e) => await listNFT(e, {name, image, price, description})} className={Styles.listNFT_btn}>{message.length > 0 ? message : "List NFT"}</button> 
          </div>          
        </div>
        <div className={Styles.form_img_container}>
        <div className={Styles.nftImage_container}>
          {image ? <Image className={Styles.nftImage} alt="uploaded NFT image" width={200} height={200} src={URL.createObjectURL(image)} />: null}
        </div>
        <div className={Styles.nftImage_input_container}>
          <label className={Styles.nftImage_label} htmlFor="nftImage">{image ? "Change Image" : "Upload NFT Image"}</label>
          <input className={Styles.nftImage_input} id="nftImage" type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
       

        </div>
      </form>
    </div>
  );
};

export default ListNFT;


// {image != null ? (
//   <Image
//     src={URL.createObjectURL(image)}
//     alt="upload nft"
//     className={Styles.nft_img}
//     width={100}
//     height={100}
//   />
// ) : (
//   <p className={Styles.image_alt}>Upload Your NFT Image</p>
// )}