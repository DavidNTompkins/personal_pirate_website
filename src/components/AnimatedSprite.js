import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedSprite({ spriteSheetUrl, isMobile }) {
  const [showBubble, setShowBubble] = useState(false);
  const spriteRef = useRef(null); // Ref for the sprite element

  useEffect(() => {
    // Function to handle clicks outside of the sprite to close the bubble
    const handleClickOutside = (event) => {
      if (showBubble && spriteRef.current && !spriteRef.current.contains(event.target)) {
        setShowBubble(false);
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBubble]); // Effect depends on the showBubble state

  // Toggle bubble visibility and prevent event propagation
  const toggleBubble = (event) => {
    event.stopPropagation();
    setShowBubble(!showBubble);
  };

  return (
    <div 
      className="sprite-container" 
      onClick={toggleBubble} 
      ref={spriteRef} // Assign the ref to the div
      style={{ 
        position: 'absolute', 
        bottom: isMobile ? '50%': '48%', 
        left: isMobile ? '32%' : '38%', 
        transform: 'translate(-50%, 0%)', 
        cursor: 'pointer', 
        zIndex: '100' 
      }}>
      <div className="sprite" style={{
        width: '64px',
        height: '64px',
        backgroundImage: `url(${spriteSheetUrl})`,
        backgroundRepeat: 'no-repeat',
        animation: 'sprite-animation 1s steps(12) infinite',
        position: 'absolute',
        transform: 'translate(-50%, 0%) scale(1)',
      }}>
      </div>
      {showBubble && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '30%',
          transform: 'translate(-50%, -20px)',
          minWidth: '150px',
          width: '300px',
          maxWidth: 'calc(max(500px,45vw))',
          background: 'white',
          border: '2px solid black',
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'center',
          fontSize: '14px',
          color: 'black',
          zIndex: '100',
        }} className="speech-bubble">
          {"Ahoy! I'm David Tompkins, I'm a grad student at Cornell in developmental psychology. I also like making things with AI. Click the clouds for a few projects, or click the ship to get links to stay in touch."}
        </div>
      )}
      <style jsx>{`
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -9px; // Position it just below the speech bubble
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid white; // Color should match the speech bubble's background
        }
      `}</style>
    </div>
  );
}
