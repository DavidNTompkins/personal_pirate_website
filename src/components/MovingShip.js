// MovingShip.jsx
import React from 'react';

const MovingShip = ({ imagePath }) => {
  return (
    <div className="ship-container left-32">
      <img src={imagePath} alt="Ship" className="ship" />
    </div>
  );
};

export default MovingShip;
