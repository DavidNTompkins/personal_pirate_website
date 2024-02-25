// components/Island.js
import React from 'react';
import AnimatedSprite from './AnimatedSprite';

export default function Island({isMobile}) {
    return (
      <div className="island absolute z-30" style={{ bottom: isMobile ? 'calc(35vh)' : 'calc(33vh)', left: '50vw', transform: 'translate(-50%, 50%)' }}>
        <img src="/island2.png" alt="Island" style={{ width: 'auto', height: 'auto', maxWidth: isMobile ? 'calc(min(60vw,400px))' :'calc(min(30vw,400px))'  }} />
        <AnimatedSprite spriteSheetUrl="/piratesprite.png" isMobile={isMobile} />
      </div>
    );
}
