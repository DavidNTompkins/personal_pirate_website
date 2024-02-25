import React from "react";

import Ocean from "@/components/Ocean";
import Sky from "@/components/Sky";
import Island from "@/components/Island";
import CloudContainer from "@/components/CloudContainer";
import MovingShip from "@/components/MovingShip";
import { useState, useEffect } from "react";
export default function Home() {


  function useMobileDetect() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        const isMobileView = window.innerWidth < 768;
        setIsMobile(isMobileView);
        console.log(isMobileView); // Log the current state of `isMobileView`
      };

      // Run once on mount
      checkMobile();

      // Add event listener for resize
      window.addEventListener('resize', checkMobile);

      // Clean up event listener
      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
  }

  const isMobile = useMobileDetect();

  const cloudData = [
    // Your cloud data objects here
    {
      title: 'Narrator - AI RPG',
      text: 'Narrator - AI RPG',
      image: '/narratorBanner2.png',
      explanation: 'An open concept AI Roleplaying game. Create a character, build a world, etc. Built from scratch, uses a variety of LLMs and image models.',
      position: {top: 25, left: 25, mobileTop: 10, mobileLeft: 5 },     
       link: "https://playnarrator.com/"
    },
    {
      title: 'Gifshift - AI Gifs',
      text: 'Gifshift - AI Gifs',
      image: '/dancingbear_shift.webp',
      explanation: 'A GIF-2-GIF pipeline using an animatediff workflow. Powered by fal.ai. Frontend: nextjs with tailwind. Backend: node express server.',
      position: { top: 35, left: 50, mobileTop: 55, mobileLeft: 35 },      
      link: "https://gifshift.xyz/"
    },
    /*{
      title: 'Project 1',
      text: 'Cloud 1',
      image: '/path/to/image1.jpg',
      explanation: 'An explanation of Project 1.',
      position: { top:35, left:60 }, // Example movement
    },*/

    

    // Add more cloud data objects
  ];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <CloudContainer clouds={cloudData} />
    <Sky />
    <MovingShip imagePath={"/ship.png"} className="left-0"/>
     <Island />
   <Ocean />
   </div>
  );
}
