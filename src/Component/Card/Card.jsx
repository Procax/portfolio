import React from 'react'
import '../Card/Card.css'

const Card = ({imageUrl, title, description, stack, link}) => {
  return (
    <div className='Card'>
      { link && <a href={link}>
      {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
      <div>
            <h2 className='heading'>{title}</h2>
            <h4>{description}</h4>
        </div>
        <div>
            <h4>{stack}</h4>
        </div>
        </a>
      }
      
    </div>
  )
}

export default Card
