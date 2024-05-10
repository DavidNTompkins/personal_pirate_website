import React, { useState, useEffect, useRef } from 'react';

const CitationCloud = ({ cloud, citations, style, isMobile }) => {
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

  const mobileCenterStyle = isMobile && isExpanded ? { top: '55%', left: '50%', transform: 'translate(-50%, -50%)' } : {};

  const cloudStyle = {
    backgroundImage: `url('${cloud}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div
      ref={cloudRef}
      className={`${isExpanded ? 'z-30 duration-100' : 'floating-cloud z-20 duration-500'}
        absolute
        transition-all
         ${isExpanded ? 'w-96 h-96' : 'w-48 h-32'} rounded-md`}
      style={{ ...style, ...mobileCenterStyle, ...(isExpanded ? {} : cloudStyle), transitionDuration: '300ms' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded && (
        <div className="text-black flex flex-col items-center 
        justify-top bg-white bg-opacity-90
         rounded-md p-4 absolute overflow-auto" style={{ maxHeight: isMobile ? '65vh': '45vh', minHeight: '300px' }}>
          <h3 className="text-lg text-black font-semibold mb-2">References</h3>
          <ul>
            {citations.map((citation, index) => (
              <li key={index} className="text-sm mb-3">
                {false && citation.title && <div className="font-semibold">{citation.title}</div>}
                {citation.description && <div>{citation.description}</div>}
                {citation.link && <a href={citation.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition duration-300">Read more</a>}
              <br/>
            
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isExpanded && (
        <div className="flex items-center justify-center absolute w-full h-full">
          <span className="text-sm font-semibold text-black">Research</span>
        </div>
      )}
    </div>
  );
};

export default CitationCloud;
