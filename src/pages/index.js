import React from "react";
import Head from "next/head";

import Ocean from "@/components/Ocean";
import Sky from "@/components/Sky";
import Island from "@/components/Island";
import CloudContainer from "@/components/CloudContainer";
import MovingShip from "@/components/MovingShip";
import { useState, useEffect } from "react";
import PlayableImage from "@/components/PlayableImage";
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
      explanation: 'Any Story - Any Game. An AI Roleplaying game that supported a variety of LLMs, generates images during each game, and allows for user-generated-content. React frontend, Node Backend.',
      position: {top: 25, left: 25, mobileTop: 8, mobileLeft: 5 },     
       link: "https://playnarrator.com/"
    },
    {
      title: 'Gifshift - AI Gifs',
      text: 'Gifshift - AI Gifs',
      image: '/dancingbear_shift.webp',
      cloud: '/cloud2.png',
      explanation: 'Shift that GIF! A GIF-2-GIF pipeline using an animatediff workflow. Powered and supported by fal.ai. Nextjs frontend, Node backend.',
      position: { top: 35, left: 50, mobileTop: 53, mobileLeft: 42 },      
      link: "https://gifshift.xyz/"
    },
    {
      title: 'Work with me?',
      text: 'Work with me?',
      image: '/business_dave.png',
      cloud: '/cloud5.png',
      explanation: "I'm always looking for colabs. If you're someone who likes making things (for or not for profit), hit me up! Right now I'm interested in play, toy/game, and using language models to solve useful problems.",
      position: { top: 45, left: 30, mobileTop: 23, mobileLeft: 45 },      
      link: "https://twitter.com/DavidNTompkins"
    },
    {
      title: 'Interests',
      text: 'Interests',
      image: 'babytime.png',
      cloud: '/cloud10.png',
      explanation: "I'm interested in generalizability over macro time in developmental psychology. To what extent does macro (historical) time limit generalizability of developmental findings? Which portions of the field are the most susceptible to this? My working theory is that intra-personal sensitivity on the developmental timescale might be related to inter-personal sensitivity on the historical timescale. I have a little data to support this - if you're interested, get in touch!",
      position: { top: 65, left: 43, mobileTop: 65, mobileLeft: 5 },      
      link: "https://twitter.com/DavidNTompkins"
    },
    // Add more cloud data objects
  ];

  const citations =  [{
    title: 'Research',
    description: 'Tompkins, D. N., Beckner, A. G., Bambha, V. P., LoBue, V., Oakes, L. M., & Casasola, M. (2024, March). Robots among children: Comparing child and GPT-4 performance on a global-local processing task. Poster presented at the meeting of the Cognitive Development Society, Pasadena, CA.',
    link: ''    
  },
  {
    title: 'Research',
    description: 'Beckner, A. G., Katz, M., Tompkins, D. N., Voss, A. T., Winebrake, D., LoBue, V., Oakes, L. M., & Casasola, M. (2023). A Novel Approach to Assessing Infant and Child Mental Rotation. Journal of Intelligence, 11(8), Article 8. https://doi.org/10.3390/jintelligence11080168',
    link: ''    
  },
  {
    title: 'Research',
    description: 'Tompkins, D. N., Radulescu, M., Jagid, N., Portnoy, M., Abii, O., Man, B., Voss, A., LoBue, V., Oakes, L.M., Casasola, M., (2022, April 21-23). The Development and Testing of a Novel Face Controlled Experimental Tool for Toddlers and Young Children [Poster Presentation]. Cognitive Development Society Bi-Ennial Meeting 2022. Madison, WI, United States.',
    link: ''    
  },
  {
    title: 'Research',
    description: 'Bambha, V.P., Beckner, A.G., Pochinki, N., Tompkins, D. N., LoBue, V., Oakes, L.M., Casasola, M. (2022, April 2). Putting the Pieces Together: Early spatial problem-solving in the context of puzzle play. [Conference presentation]. SRCD Special Topic Meeting: Learning through Play and Imagination. St. Louis, MO.',
    link: ''    
  },
  {
    title: 'Research',
    description: 'Tompkins, D. N., Guevara, V., Portnoy, M., Kushnir, T., & Casasola, M., (2021, April 08). Do Spatial Labels Facilitate Children’s 2D-to-3D Transfer of Relational Information in a Spatial Mapping Task? [Conference presentation]. Society for Research in Child Development, Virtual Conference.',
    link: ''    
  },]

  return (
    <>
    <Head>
      <title>David Tompkins</title>
      <meta name="description" content="Developmental psychology, games, and more" />
      <meta name="keywords" content="Developmental Psychology, Cornell, Human Development, LLMs, AI, Narrator, Toys" />
      {/* Open Graph tags for social media sharing */}
      <meta property="og:title" content="David Tompkins - Personal Website" />
      <meta property="og:description" content="Developmental Researcher who likes to make things" />
      {/* Add more meta tags as needed */}
    </Head>
    <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "http://schema.org",
      "@type": "Person",
      "name": "David Tompkins",
      "url": "https://david.tompkins.computer",
      "sameAs": [
        "https://twitter.com/davidntompkins",
        "https://github.com/DavidNTompkins"
      ]
    })
  }}
/>
    <div className="relative h-screen w-screen overflow-hidden z-20">
      <CloudContainer clouds={cloudData} citations={citations} />
    <Sky />
    <MovingShip imagePath={"/ship.png"} className="left-0"/>
     <Island isMobile={isMobile} />
     <PlayableImage isMobile={isMobile}/>
   <Ocean />
   </div>
   <div style={{ display: 'none' }} aria-hidden="true">
    <h1>David Tompkins</h1>
    <p>I am a developmental researcher studying at Cornell. I also like to make things both with and without AI. I am always looking for people to team up with - send me a note!</p>
  </div>
   </>
  );
}
