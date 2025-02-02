import React from 'react'
import '../Nav/Nav.css'
import { FaGithub } from "react-icons/fa6";


const Nav = () => {
  return (
    <div className='Nav-bar'>
        <div className='Nav-links'>
          <div className='Head-name'>
          <div>KaranSinghHajari</div>
          </div>
        <div><p>Home</p></div>
        <div><p>About</p></div>
        <div><p>Work</p></div>
        <div><p>
<a href="/Karansingh-Hajari-Resume.pdf" download="Karansingh-Hajari-Resume.pdf">Resume</a>
        </p></div>

        <div className='Git-icon'>
  <a href="https://github.com/Procax" target="_blank" rel="noopener noreferrer">
    <FaGithub size='65px' />
  </a>
</div>
        </div>


      
    </div>
 
  )
}

export default Nav
