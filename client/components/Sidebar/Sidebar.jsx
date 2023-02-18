import {useState} from 'react';
import Link from "next/link"
import { useRouter } from 'next/router';

import Styles from "./Sidebar.module.css";
import { ConnectButton } from '../componentsIndex';

const Sidebar = () => {

    const [openSideMenu, setOpenSideMenu] = useState(false)

    const router = useRouter();

    const toggleMenu = () => {
        if(openSideMenu) {
            setOpenSideMenu(false);
        } else {
            setOpenSideMenu(true)
        }
    }


  return (
    <nav className={Styles.sidebar_container}> 
    <div className={Styles.logo_container}>
    <Link href="/">
        <p className={Styles.logo}>DeDev Marketplace</p>
    </Link>
        <button  onClick={toggleMenu} className={`${Styles.hamburger} ${openSideMenu ? Styles.is_active : null}`}><p className={`${Styles.bar} ${openSideMenu ? Styles.is_active : null}`}></p></button>
    </div>
    {openSideMenu ?
    (  
        <ul className={Styles.sidebar_links_container}>
    <ConnectButton />
    <Link onClick={toggleMenu} href="/" className={`${Styles.sidebar_links} ${router.pathname == "/" ? Styles.active : null}`}>Marketplace</Link>
        <Link onClick={toggleMenu} href="/profile" className={`${Styles.sidebar_links} ${router.pathname == "/profile" ? Styles.active : null}`} >Profile</Link>
        <Link onClick={toggleMenu} href="/listNFT" className={`${Styles.sidebar_links} ${router.pathname == "/listNFT" ? Styles.active : null}`} >List My NFT</Link>
    </ul>
    ) : null }
  
    </nav>
  )
}

export default Sidebar