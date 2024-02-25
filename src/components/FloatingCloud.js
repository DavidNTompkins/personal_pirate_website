  import React from 'react';

  const FloatingCloud = ({ title, text, image, explanation, onClick, link, style, isMobile }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const cloudBaseStyle = "absolute bg-white opacity-60 rounded-md transition-all duration-500 ease-out";
    // Updated sizes with additional transformations for rotation and translation
    const sizes = [
      { width: 'w-32', height: 'h-32', top: 'top-0', left: 'left-0', transform: 'translate-y-6 -translate-x-10 rotate-12' },
      { width: 'w-8', height: 'h-8', top: 'top-4', left: 'left-44', transform: '-translate-y-10 translate-x-10 rotate-24' },
      { width: 'w-40', height: 'h-32', top: 'top-8', left: 'left-24', transform: 'translate-x-44 rotate-12' },
      { width: 'w-40', height: 'h-10', top: 'top-28', left: 'left-12', transform: 'translate-y-24 rotate-30 scale-x-150' },
      // Add more pieces here for a bigger cloud with diverse movements
    ];

    // Adjusting the dynamic class for a subtler expansion
    const orbitClass = isExpanded ? 'scale-110 rotate-12' : '';
    const mobileCenterStyle = isMobile && isExpanded ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' } : {};


    return (
      <div
        className={`${isExpanded ? 'z-30': 'floating-cloud z-20'} absolute transition-all duration-500 ${isExpanded ? 'w-96 h-96' : 'w-48 h-24'} shadow-lg`}
        style={{ ...style, ...mobileCenterStyle }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {sizes.map((size, index) => (
          <div key={index}
              className={`${cloudBaseStyle} ${size.width} ${size.height} ${size.top} ${size.left} ${orbitClass} ${isExpanded && size.transform}`}
              >
          </div>
        ))}
        {isExpanded ? (
          <div className="flex flex-col items-center justify-center bg-white bg-opacity-80 rounded-md p-6 absolute w-full h-full">
            <img src={image} alt={title} className="w-full max-w-s h-48 rounded-md object-contain mb-3" />
            <h3 className="text-lg text-black font-semibold mb-1">{title}</h3>
            <p className="text-sm text-center text-black">{explanation}</p>
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 transition duration-300">
            Check it out
          </a>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-white bg-opacity-50 rounded-lg p-3 absolute w-full h-full">
            <span className="text-sm text-black">{text}</span>
          </div>
        )}
      </div>
    );
  };

  export default FloatingCloud;
