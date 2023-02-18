import {useRouter} from "next/router";
import Link from "next/link"
import { useState } from "react";

import Styles from "./Navbar.module.css";
import { ConnectButton, Sidebar } from "../componentsIndex";
import { useEffect } from "react";


const Navbar = () => {
const [openSideMenu, setOpenSideMenu] = useState(true)
const router = useRouter();
const [windowWidth, setWindowWidth] = useState("");

useEffect(() => {
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth))
 setWindowWidth(window.innerWidth);
}, [windowWidth])


  return (
    <>
      { windowWidth > 760 ? (
        <nav className={Styles.navbar}>
    <Link href="/">
    <p className={Styles.logo}>Decentra Dev Marketplace</p>
    </Link>
    <ul className={Styles.navbar_container}>
        <Link href="/" className={`${Styles.navbar_links} ${router.pathname == "/" ? Styles.active : null}`}>Marketplace</Link>
        <Link href="/profile" className={`${Styles.navbar_links} ${router.pathname == "/profile" ? Styles.active : null}`} >Profile</Link>
        <Link href="/listNFT" className={`${Styles.navbar_links} ${router.pathname == "/listNFT" ? Styles.active : null}`} >List My NFT</Link>
        <ConnectButton />
    </ul>
    </nav>
    ) : <Sidebar />
    }
    </>
  )
}

export default Navbar