import React from 'react'
import '../Card/Card.css'
import Rectangle from 'C:/Users/PC/Desktop/React/portfolio/src/Assets/Rectangle.jpg';

const Card = ({imageUrl, title, description, stack }) => {
  return (
    <div className='Card'>
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div>
            <h2 className='heading'>{title}</h2>
            <h4>{description}</h4>
        </div>
        <div>
            <h4>{stack}</h4>
        </div>


      
    </div>
  )
}

export default Card
