import React from 'react'
import './Footer.css'
import { FaGithub } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";




const Footer = () => {
  return (
    <div className='Footer'>
      <div className='Footer-Name'>
      <div>KaranSinghHajari</div>
      </div>
              <div className='Git-icon-footer'>
              <FaFacebook size='65px' />
              <FaInstagram size='68px' />
              <FaGithub size='65px'/>
              </div>
      
    </div>
  )
}

export default Footer
