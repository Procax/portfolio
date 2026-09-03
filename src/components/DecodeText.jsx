import React, { useState, useEffect } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=';

const DecodeText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      setDisplayText(text);
      return;
    }

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split('').map((letter, index) => {
          if (index < iterations) {
            return text[index];
          }
          return characters[Math.floor(Math.random() * characters.length)];
        }).join('')
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }
      
      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovering, text]);

  return (
    <span 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="font-mono cursor-default inline-block"
    >
      {displayText}
    </span>
  );
};

export default DecodeText;
