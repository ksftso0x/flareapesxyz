import React from 'react'
import logo from '../assets/logo.png'
import '../css/common.css'
import '../css/minting.css'
import banana from '../assets/banana.gif'
import bananaStatic from '../assets/bananaStatic.png'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import abi from '../config/abi.json'
import config from '../config/config.json'
import { init, useConnectWallet } from '@web3-onboard/react'
import { customToast } from '../util/customToast'
import '../css/toast.css'



function MintScreen() {

  // Nft minting
  const [nftPrice, setNftPrice] = useState(0)
  const [nftSupply, setNftSupply] = useState(0)
  const [nftMaxSupply, setNftMaxSupply] = useState(0)
  const [nftsInCart, setNftsInCart] = useState(1)
  const [maxNftsInCart, setMaxNftsInCart] = useState(5)
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  // Rewards

  const [unclaimedRewards, setUnclaimedRewards] = useState(0)
  const [lifetimeEarns, sLTE] = useState(0)

  // Other

  const [isLoading, setIsLoading] = useState(true)
  const [contract, setContract] = useState(null)
  const [saleState, setSaleState] = useState("");
  const [isWhitelisted, setIsWhitelisted] = useState(false);


  // General use functions

  const addToCart = (isNegative) => {
    let temp = nftsInCart
    if (isNegative) {
      temp -= 1
    } else {
      temp += 1
    }
    if (temp < 0) {
      temp = 0
    }
    if (temp > maxNftsInCart) {
      temp = maxNftsInCart
    }
    console.log(maxNftsInCart)
    setNftsInCart(temp)
  }

  const displayBigInt = (number) => {
    if (number == 0) {
      return "0.0000"
    }
    if (Number(ethers.utils.formatEther(number)).toFixed(4) == 0) {
      return "<0.0001"
    }
    return Number(ethers.utils.formatEther(number)).toFixed(4)
  }

  // Contract methods

  const mintNFT = (nftsInCart, nftPrice) => {
    const price = ethers.BigNumber.from(nftPrice.toString());
    const amount = ethers.BigNumber.from(nftsInCart.toString());
    const totalPrice = price.mul(amount);
    // note: manual gasLimit stops our revert problem, gas usage is not "fixed" in the contract so metamask can sometimes mis-estimate
    // in any case, even 8,000,000 gas on FLR is still practically free. We'd only ever use that much gas under normal circumstances
    // if we were minting a batch of maybe 30-40 NFTs in one hit, unused gas is refunded to the user.

    contract.mintNFT(nftsInCart, { value: totalPrice, gasLimit: 8000000 }).then((tx) => {
      tx.wait().then(async () => {
        console.log("Minted NFT")
        console.log(tx.hash);

        const supply = await contract.totalSupply()

        customToast.success(<><b>Mint Successful</b><br /><a target="_blank" href={"https://coston2-explorer.flare.network/tx/" + tx?.hash?.toString()}>See on explorer</a></>, { autoClose: 30000 })
        setNftSupply(parseInt(supply.toString()))
        // await getMintedTokens()
      }).catch((error) => {
        console.log(error)
        if (error.code === "INSUFFICIENT_FUNDS") {
          console.log("not enough funds to pay for gas fees")
          customToast.error(<><b>Transaction failed</b><br />Not enough funds to pay for gas fees</>, { autoClose: 30000 })
        } else

          if (error.code === "NETWORK_ERROR") {
            console.log("could not validate transaction, check that you're on the right network")
            customToast.error(<><b>Transaction failed</b><br />Could not validate transaction, check that you're on the right network</>, { autoClose: 30000 })

          } else

            if (error.code === "TRANSACTION_REPLACED") {
              console.log("the transaction was replaced by another transaction with the same nonce")
              customToast.error(<><b>Transaction failed</b><br />The transaction was replaced by another transaction with the same nonce</>, { autoClose: 30000 })

            }
            // if(error.code === "MISSING_ARGUMENT")
            // {
            //   // Should be fine to ignore, no idea why that pops up sometimes
            //   console.log("missing argument")

            // }
            else {
              console.log(error)
              customToast.error(<><b>Transaction failed</b><br />{error?.data?.message}</>, { autoClose: 30000 })
            }


      })
    }).catch((error) => {
      console.log(error)
      customToast.error(<><b>Failed to send a transaction</b><br />{error?.data?.message}</>, { autoClose: 30000 })
    })

  }

  // const getMintedTokens = async () => {
  //   let xx = await contract.mintsByAddress(wallet?.accounts[0]?.address);
  //   console.log(xx);
  // }

  const claimRewards = () => {
    console.log("Claiming rewards for address: " + wallet.accounts[0]['address'])
    const options = { gasLimit: 8000000, value: 0 }
    contract.claimRewards(wallet.accounts[0]['address'], options).then((tx) => {
      tx.wait().then(async () => {
        console.log("Claimed rewards")

        const rewards = await contract.getRewardsAmount(wallet.accounts[0]['address'])
        setUnclaimedRewards(rewards)

        await new Promise(resolve => setTimeout(resolve, 500))

        const ltearns = await contract.lifetimeEarnings(wallet.accounts[0]['address'])
        sLTE(ltearns)

      })
    })
  }


  // Get contract data


  const getContractData = async () => {
    try {
      if (!wallet) {
        console.log('Wallet not connected.')
        return
      }
      if (wallet.chains[0]['id'] !== config.CHAIN_ID) {
        customToast.error(<><b>Invalid chain</b><br />Please connect to the Flare network</>, { toastId: "erro", autoClose: 30000 })
        throw new Error('Invalid chain.')
      }

      console.log('wallet', wallet.accounts[0]['address'])
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(config.ADDR_CONTRACT, abi, signer)
      if (!contract) {
        customToast.error(<><b>Error</b><br />Failed to initialize contract.</>, { toastId: "erro", autoClose: 30000 })
        throw new Error('Failed to initialize contract.')
      }
      setContract(contract)

      const getStuff = async () => {

        const supply = await contract.totalSupply()
        setNftSupply(parseInt(supply.toString()))

        await new Promise(resolve => setTimeout(resolve, 500))
        console.log("supply", supply.toString())

        const rewards = await contract.getRewardsAmount(wallet.accounts[0]['address'])
        setUnclaimedRewards(rewards)

        await new Promise(resolve => setTimeout(resolve, 500))

        const ltearns = await contract.lifetimeEarnings(wallet.accounts[0]['address'])
        sLTE(ltearns)

        await new Promise(resolve => setTimeout(resolve, 500))
        console.log("rewards", rewards)

        // add cfg to contract
        const cfg = await contract.cfg()
        console.log(cfg.MAX_SUPPLY)
        setNftMaxSupply(parseInt(cfg.MAX_SUPPLY.toString()))
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log("cfg", cfg)


        const price = await contract._MINT_PRICE();
        setNftPrice(price.toString())

        await new Promise(resolve => setTimeout(resolve, 500))
        console.log("price", price.toString())

        const saleState = await contract.getContractState()
        setSaleState(saleState)
        if (saleState == "presale") {
          setMaxNftsInCart(5)
        } else {
          setMaxNftsInCart(10)
        }

        await new Promise(resolve => setTimeout(resolve, 500))
        console.log("saleState", saleState)

        const isWhitelisted = await contract.presaleWhitelist(wallet.accounts[0]['address'])
        setIsWhitelisted(isWhitelisted)
        console.log("isWhitelisted", isWhitelisted)
        setTimeout(async () => {
          await getStuff()
        }, 5000)
      }
      await getStuff();


      if (isLoading) setIsLoading(false)

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {

    if (!connecting) getContractData()
  }, [wallet])




  // useEffect(() => {
  //   getContractData()
  // }, [wallet])

  // Render

  if (!wallet) {
    return
  }
  if (wallet.chains[0]["id"] !== config.CHAIN_ID) {
    return (
      <div className='flex-column'>
        <img src={bananaStatic} className="wrong-network title big'" alt="Grayed out banana" />
        <h4 className='centered title marginless-top'>Please connect to the {config.CHAIN_NAME} network</h4>
      </div>
    )
  }
  if (isLoading) {
    return (
      <img src={banana} className="loading title big'" alt="loading..." />
    )
  }

  if (saleState === "disabled" || saleState === "deploying") {
    return (
      <div className='flex-column'>
        <img src={bananaStatic} className="wrong-network title big'" alt="Grayed out banana" />
        <h4 className='centered title marginless-top'>The mint isn't live yet</h4>
      </div>
    )
  }

  if (!isWhitelisted && saleState === "presale") {
    return (
      <div className='flex-column'>
        <img src={bananaStatic} className="wrong-network title big'" alt="Grayed out banana" />
        <h4 className='centered title marginless-top'>You are not whitelisted</h4>
      </div>
    )
  }


  if (nftSupply < nftMaxSupply) {
    return (
      <div className='mint-screen neon-border flex-column transparent-bg' style={{ "maxWidth": "30em" }}>
        <h1 className='centered title big'>{nftSupply.toString()} / {nftMaxSupply.toString()}</h1>
        <h2 className='centered title marginless-bottom'>1 {config.TOKEN_NAME} costs {displayBigInt(nftPrice)} FLR</h2>
        <h3 className='centered neon marginless-top'>Excluding gas fees</h3>
        <div className='mint-input-holder'>
          <button className='btn neon-border' onClick={() => { addToCart(true) }} disabled={nftsInCart === 0}>-</button>
          <p className='neon centered big'>{nftsInCart}</p>
          <button id="pb" className='btn neon-border' onClick={() => { addToCart(false) }} disabled={nftsInCart === maxNftsInCart}>+</button>
        </div>
        {console.log("cond: ", (nftSupply + nftsInCart), nftMaxSupply)}
        <button id="mintButton" className='btn neon-border marginless-top' onClick={() => { mintNFT(nftsInCart, nftPrice) }} disabled={nftsInCart === 0 || (nftSupply + nftsInCart) > nftMaxSupply} >Mint {nftsInCart} {config.TOKEN_SYMBOL}</button>
        <h3 className='centered title marginless-bottom'>Current rewards:</h3>
        <h4 className='neon centered big marginless-top'>{displayBigInt(unclaimedRewards)}</h4>
        <button className='btn neon-border' onClick={() => { claimRewards() }} disabled={unclaimedRewards == 0}>Claim rewards</button>
        <h4 className='centered title marginless'>Lifetime rewards:</h4>
        <h2 className='neon centered marginless-top margin-bottom'>{displayBigInt(lifetimeEarns)}</h2>
      </div>
    )
  }

  return (
    <>

      <div className='mint-screen neon-border flex-column transparent-bg' style={{ "maxWidth": "30em" }}>
        <h1 className='centered title big'>{nftSupply.toString()} / {nftMaxSupply.toString()}</h1>
        <h2 className='centered title marginless-top'>We have fully sold out!</h2>
        {console.log("cond: ", (nftSupply + nftsInCart), nftMaxSupply)}
        <h3 className='centered title marginless-bottom'>Current rewards:</h3>
        <h4 className='neon centered big marginless-top'>{displayBigInt(unclaimedRewards)}</h4>
        <button className='btn neon-border' onClick={() => { claimRewards() }} disabled={unclaimedRewards == 0}>Claim rewards</button>
        <h4 className='centered title marginless'>Lifetime rewards:</h4>
        <h2 className='neon centered marginless-top margin-bottom'>{displayBigInt(lifetimeEarns)}</h2>
      </div></>
  )


}


export default function Starter() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  if (wallet)

    return (
      <div className='full-screen-holder' style={{ "marginTop": "0em" }} id="mint">
        <MintScreen></MintScreen>
      </div>
    )
  return (<></>);
}
