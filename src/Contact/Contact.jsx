import React from 'react'
import './Contact.css'

const Contact = () => {
  return (
    <div className='Contact'>
    <div className='Contact-me'>
    <div>
    <h1>
      Contact me
    </h1>
    </div>
    <div>
    <div className="underline-only"></div>
    </div>
    
  </div>
  <div className='Form'>
    <div className='paragraph'>
    I would love to hear about your project and how I can help. Please fill in the form, and I’ll get back to you as soon as possible.
    </div>
<div className='Name' >
  <input type="text" name="" id="" placeholder='Name'/>
</div>
<div className='Email'>
<input type="text" name="" id="" placeholder='Email'/>
</div>
<div className='Message'>
  <input type="text" placeholder='Message' />
</div>
<div className='btn'>
<button className="button"> Send Message
</button>
</div>
</div>


  </div>
  )
}

export default Contact
