import React from 'react'
import profileImage from '../Assets/profile.jpeg';
import './Profile.css'
import { TfiHtml5 } from "react-icons/tfi";
import { SiCsswizardry } from "react-icons/si";
import { SiJavascript } from "react-icons/si";
import { FaReact } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { FaGitAlt } from "react-icons/fa6";
import { AiOutlineGithub } from "react-icons/ai";
import { BsBootstrap } from "react-icons/bs";
import Section from '../Card-Section/Section';
import Contact from '../Contact/Contact';





const Profile = () => {
  return (
    <div >
      <div className='Profile'>


        <div>
            <h2>Hello, I&apos;m KaranSinghHajari</h2>
            <h1>Front-end <br />
                <span>Developer</span>
            </h1>
            <h2 className='contact'>Available for your next build</h2>
        </div>
        <div className='image'>
           <img className='profile-img' src={profileImage} alt="profile-image" /> 
        </div>

        </div>

        <div className='About'>
          <div>
          <h1>
            About
          </h1>
          </div>
          <div>
          <div className="underline-only"></div>
          </div>


        </div>
        <div className='About-desc'>
          <p>
          I design and build refined digital experiences that blend strong visual design with dependable front-end performance.
          With a solid foundation in HTML, CSS, JavaScript, and React, I turn ideas into responsive, accessible interfaces that feel fast, clear, and intuitive.
          I enjoy translating product goals into thoughtful user experiences that are clean, scalable, and built to make an impact.
          Constantly learning and refining my craft, I focus on creating work that is both visually polished and genuinely useful.
          </p>
        </div>
        <div className='MySkills'>
          <h1>
           Core Stack
          </h1>
          <div className='Logo'>
            <div className='Logo-1'>
            <div>
              <TfiHtml5 size={165} />
              </div>
              <div>
              <SiCsswizardry size={150} />
              </div>
              <div>
              <SiJavascript size={150} />
              </div>
              <div>
              <FaReact size={160}/>
              </div>
            </div>
            <div className='Logo-2'>
              <div>
              <VscVscode size={170}/>
              </div>
              <div>
              <FaGitAlt size={180} />
              </div>
              <div>
              <AiOutlineGithub size={170} />
              </div>
              <div style={{ paddingTop: '16px', paddingRight: '28px'}}>
              <BsBootstrap size={150}/>
              </div>

            </div>




          </div>
        </div>

        <Section />
        <Contact />

      
    </div>
  )
}

export default Profile
