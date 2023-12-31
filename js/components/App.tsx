import React from 'react'
import '../css/main.css'
import '../css/common.css'
import Header from './Header.jsx'
import About from './About'
import Starter from './Starter'
import Background from './Background'
import Roadmap from './Roadmap'
import Team from './Team'
import config from '../config/config.json'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
// import flareIcon from '../assets/FLR.png'

// Web3 Onboard
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import { ethers } from 'ethers'
import Onboard from '@web3-onboard/core'
import walletConnectModule from '@web3-onboard/walletconnect'
import ledgerModule from '@web3-onboard/ledger'
import dcentModule from '@web3-onboard/dcent'

const injected = injectedModule()

const walletConnect = walletConnectModule({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModalOptions: {
      mobileLinks: ['rainbow', 'metamask', 'argent', 'trust', 'imtoken', 'pillar']
  },
  connectFirstChainId: true
})

const ledger = ledgerModule()

const dcent = dcentModule()

// initialize Onboard
init({
  wallets: [injected, walletConnect, ledger, dcent],
  chains: [
    {
      id: config.CHAIN_ID,
      token: config.CHAIN_TOKEN_NAME,
      label: config.CHAIN_LABEL,
      rpcUrl: config.CHAIN_URI,
      // Adding the icon breaks the widget for some dumb reason
      //icon: flareIcon,
    }
  ],
  theme: 'system',
  notify: {
    desktop: {
      enabled: true,
      transactionHandler: transaction => {
        console.log({ transaction })
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: 'Your transaction from #1 DApp is in the mempool',
          }
        }
      },
      position: 'bottomRight'
    },
    mobile: {
      enabled: true,
      transactionHandler: transaction => {
        console.log({ transaction })
        if (transaction.eventCode === 'txPool') {
          return {
            type: 'success',
            message: 'Your transaction from #1 DApp is in the mempool',
          }
        }
      },
      position: 'bottomRight'
    }
  },
  accountCenter: {
    desktop: {
      position: 'bottomRight',
      enabled: true,
      minimal: true
    },
    mobile: {
      position: 'bottomRight',
      enabled: true,
      minimal: true
    }
  },

})

export default function App() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // create an ethers provider
  let ethersProvider

  if (wallet) {
    // if using ethers v6 this is:
    // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
  }

  return (
    <div className='main-content'>
      <ToastContainer
          toastStyle={{backgroundColor: "rgba(32,32,32,0.6)", color: "yellow"}}
          bodyStyle={{backgroundColor: "transparent", color: "yellow"}}
          //bodyClassName={() => "text-sm font-white font-med block p-3"}
          autoClose={3000}
          limit={3}
      ></ToastContainer>
      <Background></Background>
      <Starter></Starter>
      <About></About>
      <Roadmap></Roadmap>
      <Team></Team>
      <footer>
        <p className='neon'>Canary Punks © All Rights Reserved</p>
      </footer>
      <Header>
        <button className='neon-border btn' disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
          {connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
        </button>
      </Header>
    </div>
  )
}
