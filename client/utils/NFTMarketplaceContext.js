import React, { useContext, useState } from "react";
import NFTMarketplaceJSON from "./NFTMarketplace.json";
import { ethers } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
// import { getContractAddress } from "ethers/lib/utils";
import axios from "axios";

const contractAddr = "0xF1Df2B7241A77AEe4F0223c1636b38671C44C318";
const NFTMarketplaceAbi = NFTMarketplaceJSON.abi;





const NFTMarkeplaceContext = React.createContext();

const NFTMarketplaceProvider = ({ children }) => {

  const [currentAddress, setCurrentAddress] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [message, setMessage] = useState("");
  // const [fileURL, setFileURL] = useState("");
  let fileURL = "";

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const chainId = await provider.send("eth_chainId", []);
    console.log(chainId);
    if (chainId != "0x5") {
      window.alert("Please connect to the Goerli Testnet");
      throw new Error("Please Switch to the Goerli Testnet");
    }

    if (needSigner) {
      const signer = provider.getSigner();
      console.log(signer)
      return signer;
    }
    return provider;
  };

  const connectWallet = async () => {
    try {
      const provider = await getProviderOrSigner();
      console.log("Wallet Connected");

      const accounts = await provider.send("eth_requestAccounts", []);
      setCurrentAddress(accounts[0]);
      setWalletConnected(true);

    } catch (error) {
      console.log("Error connecting with the wallet", error);
    }
  };

  const getMarketplaceInstance = (providerOrSigner) => {
    const instance =  new ethers.Contract(
      contractAddr,
      NFTMarketplaceAbi,
      providerOrSigner
    );
    return instance;
  };

  const uploadImgToIPFS = async (file) => {
    console.log("Control over to uploadImgToIPFS")
    try {
      // uploading file to IPFS
      const response = await uploadFileToIPFS(file);
      console.log("Uploading Image to IPFS...", response);
      if (response.success == true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        fileURL = response.pinataURL;
      }
    } catch (error) {
      console.log("Error during uploading file", error);
    }
  };

  const uploadMetadataToIPFS = async (nftJSON) => {
    console.log("Control over to uploadMetadataToIPFS")

    try {
      //upload the metadata JSON to IPFS
      console.log("Uploading Metadata to IPFS...")
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  };

  const listNFT = async (e, { name, image, price, description }) => {
    e.preventDefault();
    e.target.disabled = true;

    console.log("I Got Clicked", name, description, price, image)
    setMessage("Checking Data");
    if (name=="" || description=="" || price=="" || !image){
      setMessage("Details Incomplete");
      return;
    } 

    // Upload Img to IPFS
    try {
      setMessage("Uploading Image to IPFS...");
      await uploadImgToIPFS(image);

      console.log("url of file after uploading NFT --> ", fileURL);
      const nftJSON = {
        name,
        description,
        price,
        image: fileURL,
      };

      setMessage("Uploading Metadata to IPFS...");

      const metadataURL = await uploadMetadataToIPFS(nftJSON);
      const signer = await getProviderOrSigner(true);

      setMessage("Listing the NFT to the Marketplace... Please Wait")

      const contract = await getMarketplaceInstance(signer);
      // console.log("Contract Instance -->", contract);
      const tokenPrice = ethers.utils.parseUnits(price, "ether");

      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let txn = await contract.createToken(metadataURL, tokenPrice, { value: listingPrice});
      await txn.wait();
      setMessage("");
      alert("Successfully listed the NFT");

      location.replace("/");


    } catch (error) {
      e.target.disabled = false;
      setMessage("List NFT");
      console.log("Error Listing the NFT", error);
    }
  };


  const fetchMarketItems = async (setItems, setDataFetched) => {
    try {
      const provider = await getProviderOrSigner();
      const contract = getMarketplaceInstance(provider);

      console.log(contract);

      let transaction = await contract.getMarketItems();
      if(!transaction) {
        return;
      }

      const items = await Promise.all(transaction.map(async (el) => {
        const tokenURI = await contract.tokenURI(el.tokenId);
        console.log("token URI --> ", tokenURI);
        const ipfsHash = tokenURI.substring(tokenURI.lastIndexOf("/") + 1);
        // console.log('ipfs hash', ipfsHash)

        let meta = await axios.get(`/api/${ipfsHash}`);
        meta = meta.data
        console.log("Meta -> ", meta);

        let price = ethers.utils.formatUnits(el.price.toString(), 'ether');


        let item = {
          price,
          tokenId: el.tokenId.toNumber(),
          seller: el.seller.toLowerCase(),
          owner: el.owner.toLowerCase(),
          image: meta.image,
          name: meta.name,
          description: meta.description,
      }

        return item;
      }))

      setDataFetched(true);
      console.log(items);
      setItems(items);
    } catch (error) {
      console.log("Error Fetching Market Items", error)
    }
  }

  const fetchTokenForId = async (tokenId) => {
    const provider = await getProviderOrSigner(false);
    const contract = await getMarketplaceInstance(provider);
    console.log("token Id ==> ", tokenId);

    try {
      const token = await contract.getListedTokenForId(tokenId);
      const tokenUrl = await contract.tokenURI(tokenId);
      const ipfsHash = tokenUrl.substring(tokenUrl.lastIndexOf("/"));
      let meta = await axios.get(`/api/${ipfsHash}`);
      meta = meta.data;
      let price = ethers.utils.formatUnits(token.price.toString(), 'ether');
      let item = {
        price: price,
        name: meta.name,
        description: meta.description,
        seller: token.seller.toLowerCase(),
        owner: token.owner.toLowerCase(),
        tokenId: tokenId.toString(),
        image: meta.image
      }

      return item;
      
    } catch (error) {
      console.log(error);

    }

  }

  const fetchOwnedItems = async (setDataFetched) => {
    try {
      const provider = await getProviderOrSigner(false);
    const contract = await getMarketplaceInstance(provider);

    let transaction = await contract.connect(currentAddress).getMyNFTs();
    if(!transaction) {
      console.log("No Owned NFTs Found")
      return;
    }
    const ownedItems = await Promise.all(transaction.map(async (el) => {
      const tokenURI = await contract.tokenURI(el.tokenId);
      console.log("token URI --> ", tokenURI);
      const ipfsHash = tokenURI.substring(tokenURI.lastIndexOf("/") + 1);
      // console.log('ipfs hash', ipfsHash)

      let meta = await axios.get(`/api/${ipfsHash}`);
      meta = meta.data
      console.log("Meta -> ", meta);

      let price = ethers.utils.formatUnits(el.price.toString(), 'ether');


      let item = {
        price,
        tokenId: el.tokenId.toNumber(),
        seller: el.seller.toLowerCase(),
        owner: el.owner.toLowerCase(),
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }

      return item;
    }))

    setDataFetched(true);

    return ownedItems
    } catch (error) {
      setDataFetched(true);
      console.log("ERROR FETCHING OWNED ITEMS -> ", error)
    }
    
  }

  const fetchListedItems = async (setDataFetched) => {
    try {
      const provider = await getProviderOrSigner(false);
    const contract = await getMarketplaceInstance(provider);

    const transaction = await contract.connect(currentAddress).getListedItems();
    if(!transaction) {
      console.log("No Listed NFTs Found")
      return;
    }

    const listedItems = await Promise.all(transaction.map(async (el) => {
      const tokenURI = await contract.tokenURI(el.tokenId);
      console.log("token URI --> ", tokenURI);
      const ipfsHash = tokenURI.substring(tokenURI.lastIndexOf("/") + 1);
      // console.log('ipfs hash', ipfsHash)

      let meta = await axios.get(`/api/${ipfsHash}`);
      meta = meta.data
      console.log("Meta -> ", meta);

      let price = ethers.utils.formatUnits(el.price.toString(), 'ether');


      let item = {
        price,
        tokenId: el.tokenId.toNumber(),
        seller: el.seller.toLowerCase(),
        owner: el.owner.toLowerCase(),
        image: meta.image,
        name: meta.name,
        description: meta.description,
    }

      return item;
    }))
    setDataFetched(true);

    return listedItems;
    } catch (error) {
      setDataFetched(true);
      console.log("ERROR FETCHNING LISTED ITEMS ->", error);
    }
    
  }

  const buyNFT = async (tokenId, salePrice) => {
    try {
      if(!walletConnected) {
        alert("Please Connect Your Wallet");
        return;
      }
  
      const signer = await getProviderOrSigner(true);
      console.log("signer ", signer)
      const contract = await getMarketplaceInstance(signer);
      salePrice = ethers.utils.parseUnits(salePrice, 'ether')
  
      const transaction = await contract.executeSale(tokenId, {value: salePrice});
  
  
      await transaction.wait();
  
      alert("Successfully Bought the NFT");
      location.replace("/");
    } catch (error) {
      console.log("Error Buying NFT", error);
      window.alert("Error Purchasing NFT");
      location.replace("/");
    }

    
  }

  const resellNFT = async (tokenId, resellPrice) => {
    try {
      if(!walletConnected) {
        alert("Please Connect Your Wallet");
        return;
      }
  
      const signer = await getProviderOrSigner(true);
      // console.log("signer ", signer)
      const contract = await getMarketplaceInstance(signer);
      console.log("resell price --> ", resellPrice);
      resellPrice = ethers.utils.parseUnits(resellPrice, 'ether');
  
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();
  
      const transaction = await contract.resellToken(tokenId, resellPrice, {value: listingPrice});
  
  
      await transaction.wait();
  
      alert("Successfully Resold the NFT to the Marketplace");
      location.replace("/")
    } catch (error) {
      console.log("Error Reselling NFT", error);
      window.alert("Error Reselling NFT");
      location.replace("/")
    }
    
  }



  return (
    <NFTMarkeplaceContext.Provider
      value={{
        getProviderOrSigner,
        currentAddress,
        walletConnected,
        getMarketplaceInstance,
        connectWallet,
        setCurrentAddress,
        listNFT,
        fetchMarketItems,
        message,
        fetchTokenForId,
        fetchListedItems,
        fetchOwnedItems,
        buyNFT,
        resellNFT
      }}
    >
      {children}
    </NFTMarkeplaceContext.Provider>
  );
};

const useMarketContext = () => {
  return useContext(NFTMarkeplaceContext);
};

export default NFTMarketplaceProvider;

export { useMarketContext };
