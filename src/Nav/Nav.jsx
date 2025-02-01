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
        <div><p>Resume</p></div>

        <div className='Git-icon'>
        <FaGithub size='65px'/>
        </div>
        </div>


      
    </div>
 
  )
}

export default Nav
