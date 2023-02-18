import axios from "axios";

export default async function fetchNFTs(req, res) {


      const ipfsHash = req.query.tokenURI;
      console.log(ipfsHash);
      const tokenURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

      console.log(tokenURI);
 
      const response = await axios.get(tokenURI,  {
            headers: {
              'Accept': 'text/plain'
            }
          }).catch(err =>{
            console.log("Error from api --> ",err);
            // res.status(404).json({success: false, message: "Failed to fetch Data"})
      })
      console.log(response);
      const data = response.data;
      console.log("Data -> ", data);
      res.status(200).json(data);




}