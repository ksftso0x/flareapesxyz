import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import nft1 from '../assets/nfts/1.png';
import nft2 from '../assets/nfts/2.png';
import nft3 from '../assets/nfts/3.png';
import nft4 from '../assets/nfts/4.png';
import nft5 from '../assets/nfts/5.png';
import nft6 from '../assets/nfts/6.png';
import nft7 from '../assets/nfts/7.png';
import nft8 from '../assets/nfts/8.png';
import nft9 from '../assets/nfts/9.png';
import nft10 from '../assets/nfts/10.png';
import '../css/common.css'
import '../css/about.css'


export default function About() {
  return (
    <div className='side-by-side'>
      <div className='carousel-holder' id='about'>
        <h1 className='title'>About</h1>
        <Carousel autoPlay={true} infiniteLoop={true} centerMode={false} width="100%" >
          <img src={nft1} alt="A drawing of a monkey" />
          <img src={nft2} alt="A drawing of a monkey" />
          <img src={nft3} alt="A drawing of a monkey" />
          <img src={nft4} alt="A drawing of a monkey" />
          <img src={nft5} alt="A drawing of a monkey" />
          <img src={nft6} alt="A drawing of a monkey" />
          <img src={nft7} alt="A drawing of a monkey" />
          <img src={nft8} alt="A drawing of a monkey" />
          <img src={nft9} alt="A drawing of a monkey" />
          <img src={nft10} alt="A drawing of a monkey" />
        </Carousel>
      </div>
      <div className='neon-border flex-column transparent-bg' style={{ "maxWidth": "30em" }}>
        <h1 className='title centered'>Flare Apes</h1>
        <p className='centered'>
          5000 Utility driven, hand drawn, on-chain, upgradable Apes residing on the Flare Network. Get paid in $FLR to hold your NFTs... Royalties, FTSO, DEX and NFT Marketplace income fee's shared to all holders.
        </p>
        <p className='centered'>
          Following the Flare Apes mint, 1000 Serums capable of turning your favorite Ape into a mutant, will be airdropped to holders with a chance of receiving a Common, Rare or Super Rare Serum. Each tier rarity will mutate a different amount of traits. Commons mutating the least amount, with Super Rares mutating all traits. These mutants will also receive a portion of the DEX/MP & FTSO income.
        </p>
        <p className='centered'>
          Viridissima X Flare Apes
        </p>
      </div>
    </div>

  )
}
