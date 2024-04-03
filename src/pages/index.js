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
      cloud: '/cloud.png',
      explanation: 'Any Story - Any Game. An AI Roleplaying game that supports a variety of LLMs, generates images during each game, and allows for user-generated-content. React frontend, Node Backend.',
      position: {top: 25, left: 25, mobileTop: 10, mobileLeft: 5 },     
       link: "https://playnarrator.com/"
    },
    {
      title: 'Gifshift - AI Gifs',
      text: 'Gifshift - AI Gifs',
      image: '/dancingbear_shift.webp',
      cloud: '/cloud2.png',
      explanation: 'Shift that GIF! A GIF-2-GIF pipeline using an animatediff workflow. Powered and supported by fal.ai. Nextjs frontend, Node backend.',
      position: { top: 35, left: 50, mobileTop: 55, mobileLeft: 35 },      
      link: "https://gifshift.xyz/"
    },
    {
      title: 'Work with me?',
      text: 'Work with me?',
      image: '/business_dave.png',
      cloud: '/cloud5.png',
      explanation: "I'm looking for teammates! Right now I'm planning Summer 2024 - looking for people who want to try building something big over a summer. Send me a dm!",
      position: { top: 45, left: 30, mobileTop: 25, mobileLeft: 45 },      
      link: "https://twitter.com/DavidNTompkins"
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
    <div className="relative h-screen w-screen overflow-hidden z-20">
      <CloudContainer clouds={cloudData} />
    <Sky />
    <MovingShip imagePath={"/ship.png"} className="left-0"/>
     <Island isMobile={isMobile} />
   <Ocean />
   </div>
  );
}
