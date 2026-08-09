import React, { useState } from 'react'
import emailjs from 'emailjs-com';

import './Contact.css'

const Contact = () => {

  const [formData, setfromdata] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setfromdata({...formData, [name]: value });
  }

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log('submit')

    emailjs
    .send(
      'your_service_id',  // Your EmailJS service ID
      'your_template_id',  // Your EmailJS template ID
      formData,            // Your form data
      'your_user_id'       // Your EmailJS user ID
    )
    .then(
      (response) => {
        console.log('Message sent successfully:', response);
        alert('Message sent successfully!');
      },
      (error) => {
        console.log('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
      }
    );
};
  

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

      <div className='paragraph'>
      <p>
    I&apos;d love to hear about your project and how I can help. Share a few details below, and I&apos;ll get back to you shortly.
      </p>
    </div>
  <div className='Form'>

    <form onSubmit={handlesubmit}><div className='Name' >
 <input type="text" name="name" id="name" placeholder='Name' value={formData.name} onChange={handleChange} />
</div>
<div className='Email'>
<input type="text" name="email" id="email" placeholder='Email' value={formData.email} onChange={handleChange} />
</div>
<div className='Message'>
 <input type="text" name="message" id="message" placeholder='Message' value={formData.message} onChange={handleChange} />
</div>
<div className='btn'>
<button className="button" type="submit"> Send Message
</button>
</div>
</form>

</div>


  </div>
  )
}

export default Contact
