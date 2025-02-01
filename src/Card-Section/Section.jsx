import React from 'react'
import Card from '../Component/Card/Card'
import './Section.css'
import project1 from '../Assets/project1.png'
import project2 from '../Assets/prject2.png'

const Section = () => {
  return (
    <div>
    <div className='Contact-me'>
    <div>
    <h1>
      Work
    </h1>
    </div>
    <div>
    <div className="underline-only"></div>
    </div>
    
  </div>
        <div className='Cards'>
          
          <div>

            <Card imageUrl={project1} title='Youtube-Clone' stack='React, Redux, Tailwind CSS, Javascript '/>
        </div>
        <div>
          <Card imageUrl={project2} title='Pokedex-App' stack='React, CSS, Javascript'/>
        </div>
        {/* <div>
          <Card/>
        </div> */}
        </div>

      
    </div>
  )
}

export default Section
