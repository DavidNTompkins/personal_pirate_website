import React, { useState, useEffect } from 'react';
import FloatingCloud from './FloatingCloud';

const CloudContainer = ({ clouds }) => {
    const useMobileDetect = () => {
        const [isMobile, setIsMobile] = useState(false);
      
        useEffect(() => {
          const checkMobile = () => {
            const isMobileView = window.innerWidth < 768;
            setIsMobile(isMobileView);
          };
      
          // Run once on mount
          checkMobile();
      
          // Add event listener for resize
          window.addEventListener('resize', checkMobile);
      
          // Clean up event listener
          return () => window.removeEventListener('resize', checkMobile);
        }, []);
      
        return isMobile;
      };
      
      const isMobile = useMobileDetect();

      const [positions, setPositions] = useState([]);

      // Dynamically adjust positions based on the device
      useEffect(() => {
        const adjustPositions = clouds.map(cloud => {
          if (isMobile) {
            // Adjust positions for mobile here
            return {
              ...cloud,
              top: /* adjust `top` for mobile */ cloud.position.mobileTop ?? cloud.position.top,
              left: /* adjust `left` for mobile */ cloud.position.mobileLeft ?? cloud.position.left,
            };
          } else {
            // Use desktop positions
            return {
              ...cloud,
              top: cloud.position.top,
              left: cloud.position.left,
            };
          }
        });
    
        setPositions(adjustPositions);
      }, [clouds, isMobile]); // Recalculate when `clouds` or `isMobile` changes
    



  return (
    <div className="absolute top-0 left-0 w-full" style={{ height: '50vh' }}>
      {positions.map((pos, index) => (
        <FloatingCloud
          key={index}
          title={pos.title}
          text={pos.text}
          image={pos.image}
          link={pos.link}
          explanation={pos.explanation}
          isMobile={isMobile}
          style={{ top: `${pos.top}%`, left: `${pos.left}%`, transition: 'top 2s, left 2s' }}
        />
      ))}
    </div>
  );
};

export default CloudContainer;
