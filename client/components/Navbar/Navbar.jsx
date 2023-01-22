import {useRouter} from "next/router";
import Link from "next/link"

import Styles from "./Navbar.module.css";
const Navbar = () => {

const router = useRouter();



  return (
    <nav className={Styles.navbar}>
    <Link href="/">
    <p className={Styles.logo}>Decentra Dev Marketplace</p>
    </Link>
    <ul className={Styles.navbar_container}>
        <Link href="/" className={`${Styles.navbar_links} ${router.pathname == "/" ? Styles.active : null}`}>Marketplace</Link>
        <Link href="/profile" className={`${Styles.navbar_links} ${router.pathname == "/profile" ? Styles.active : null}`} >Profile</Link>
        <Link href="/listnft" className={`${Styles.navbar_links} ${router.pathname == "/listNFT" ? Styles.active : null}`} >List My NFT</Link>
        <Link href="/" className={`${Styles.navbar_links} ${router.pathname == "/nksd" ? Styles.active : null}`} >Button</Link>
    </ul>
    </nav>
  )
}

export default Navbar