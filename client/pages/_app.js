import '../styles/globals.css'
import {Navbar} from '../components/componentsIndex'

import NFTMarketplaceProvider from '../utils/NFTMarketplaceContext'

function MyApp({ Component, pageProps }) {
    return (
    <NFTMarketplaceProvider>
    <Navbar />
    <Component {...pageProps} />
    </NFTMarketplaceProvider>
)}

export default MyApp
