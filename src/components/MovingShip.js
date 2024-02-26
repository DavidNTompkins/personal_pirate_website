import React, { useState, useEffect, useRef } from 'react';

const MovingShip = ({ imagePath }) => {
  const [showBubble, setShowBubble] = useState(false);
  const shipRef = useRef(null); // Ref for the ship element
  const bubbleRef = useRef(null); // Ref for the bubble element

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shipRef.current && !shipRef.current.contains(event.target) && 
          bubbleRef.current && !bubbleRef.current.contains(event.target)) {
        setShowBubble(false);
      } else {
        // If the target is within the bubbleRef (i.e., a link), we should not close the bubble.
        if (bubbleRef.current && bubbleRef.current.contains(event.target)) {
          event.stopPropagation(); // Prevent closing the bubble when a link is clicked.
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBubble]);

  const handleShipClick = (event) => {
    event.stopPropagation();
    setShowBubble(true);
  };

  return (
    <div className="ship-container left-32 z-40" style={{ pointerEvents: 'none', position: 'absolute' }}>
      <img src={imagePath} ref={shipRef} alt="Ship" className="ship z-50" onClick={handleShipClick} style={{ pointerEvents: 'all', cursor: 'pointer' }}/>
      {showBubble && (
        <div ref={bubbleRef} style={{
          position: 'absolute',
          bottom: '100%',
          left: '60%',
          transform: 'translate(-50%, -20px)',
          minWidth: '150px',
          background: 'white',
          border: '2px solid black',
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'left',
          fontSize: '14px',
          color: 'black',
          zIndex: '100',
          pointerEvents: 'auto', // Ensure the speech bubble can also be interacted with
        }} className="speech-bubble">
          <a href="https://twitter.com/davidntompkins" target="_blank" rel="noopener noreferrer">Twitter ➔</a><br />
          <a href="https://discord.gg/Urpqg4MGKd" target="_blank" rel="noopener noreferrer">Discord ➔</a><br />
          <a href="https://davids-newsletter-4a95b9.beehiiv.com/subscribe" target="_blank" rel="noopener noreferrer">Newsletter ➔</a>
        </div>

      )}
    </div>
  );
};

export default MovingShip;
