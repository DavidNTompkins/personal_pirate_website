import React, { useState, useEffect, useRef } from 'react';

const FloatingCloud = ({ title, text, image, explanation, onClick, link, style, isMobile, cloud }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const cloudRef = useRef(null); // Ref for the cloud element

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExpanded && cloudRef.current && !cloudRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Adjusting dynamic class for a subtler expansion
  const orbitClass = isExpanded ? 'scale-110 rotate-12' : '';
  const mobileCenterStyle = isMobile && isExpanded ? { top: '55%', left: '50%', transform: 'translate(-50%, -50%)' } : {};

  const cloudStyle = {
    backgroundImage: `url('${cloud}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div
      ref={cloudRef} // Apply the ref here
      className={`${isExpanded ? 'z-30 duration-100' : 'floating-cloud z-20 duration-500'} absolute transition-all ${isExpanded ? 'w-96 h-96' : 'w-48 h-32'} rounded-md`}
      style={{ ...style, ...mobileCenterStyle, ...(isExpanded ? {} : cloudStyle), transitionDuration: '300ms' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded && (
        <div className="flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-md p-6 absolute w-full h-full">
          <img src={image} alt={title} className="w-full max-w-s h-48 rounded-md object-contain mb-3" />
          <h3 className="text-lg text-black font-semibold mb-1">{title}</h3>
          <p className="text-sm text-center text-black">{explanation}</p>
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition duration-300">
            Check it out
          </a>
        </div>
      )}
      {!isExpanded && (
        <div className="flex items-center justify-center absolute w-full h-full">
          <span className="text-sm font-medium text-black" style="color: black !important;">{text}</span>
        </div>
      )}
    </div>
  );
};

export default FloatingCloud;
