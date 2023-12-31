import React from 'react'
import '../css/team.css'
import nft1 from '../assets/nfts/11.png';
import nft2 from '../assets/nfts/12.png';
import nft3 from '../assets/nfts/13.png';
import nft4 from '../assets/nfts/14.png';
import nft5 from '../assets/nfts/15.png';

export default function Team() {
  return (
    <div className='full-screen-holder'>
        <h1 className='title centered' id='team'>Team</h1>
        <div className='team-holder'>
        <TeamMember name='_jp' title='Smart Contract Developer' img={nft1}/>
        <TeamMember name='TrapJK' title='Founder' img={nft2}/>
        <TeamMember name='SF90' title='Blockend Developer' img={nft3}/>
        <TeamMember name='Dazza' title='Lead Artist' img={nft4}/>
        <TeamMember name='Starsailer' title='Frontend Developer' img={nft5}/>
    </div>
    </div>
  )
}

function TeamMember(props) {
  return (
    <div className='team-member neon-border transparent-bg'>
      <img src={props.img} alt='team member' className='team-member-img'/>
      <h2 className='team-member-name neon centered'>{props.name}</h2>
      <h3 className='team-member-title neon centered'>{props.title}</h3>
    </div>
  )
}