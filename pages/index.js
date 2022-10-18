// import work with front end
// require dose not
// node =! javaScript
// backendJS is a little bit different from frontendJS

import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Our Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* <ManualHeader/> */}
            <Header />
            {/* header / connect botton / nav bar 导航栏 */}
            <LotteryEntrance />
        </div>
    )
}
