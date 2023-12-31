import React from 'react'
import logo from '../assets/logo.png'
import '../css/common.css'
import '../css/header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord } from '@fortawesome/free-brands-svg-icons'



// Display the children of the header component inside of the header element
export default function Header(props) {

  return (
    <header className='neon-border transparent-bg'>
        <img src={logo} alt="Flare Apes" className='logo-img'></img>
        <a href='#mint' className='neon-border btn'>Mint</a>
        <a href='#about' className='neon-border btn'>About</a>
        <a href='#roadmap' className='neon-border btn'>Roadmap</a>
        <a href='#team' className='neon-border btn'>Team</a>
        {props.children}
        <a href="https://twitter.com/FlareApes" className='font-awesome-btn' target="_blank"><FontAwesomeIcon className='neon' icon={faTwitter} /></a>
        <a href="http://discord.gg/8cdPB9M3e8" className='font-awesome-btn' target="_blank"><FontAwesomeIcon className='neon' icon={faDiscord} /></a>
        
    </header>
  )
}
