import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Clouds from '@/components/hero/clouds';

gsap.registerPlugin(ScrollTrigger);

const ILLUSTRATIONS = [
  {
    src: '/hero/4.png',
    alt: 'Person 4',
    // Mobile: Floating mid-left bg | Desktop: Far Left, moved up
    className: "bottom-[55%] left-[-8%] w-[45vw] opacity-30 md:opacity-100 md:bottom-[35vh] md:left-[5vw] md:w-[15vw] -rotate-12 md:-rotate-6 z-0",
  },
  {
    src: '/hero/3.png',
    alt: 'Person 3',
    // Mobile: Far Right mid | Desktop: Mid Left, moved further left
    className: "top-[12%] right-[-5%] w-[48vw] rotate-12 md:top-auto md:bottom-[8vh] md:left-[12vw] md:right-auto md:w-[18vw] md:rotate-3 z-0 md:z-10",
  },
  {
    src: '/hero/2.png',
    alt: 'Person 2',
    // Mobile: Mid area | Desktop: Top Right under the CTA button
    className: "bottom-[22%] left-[5%] w-[35vw] md:top-[12vh] md:right-[3vw] md:bottom-auto md:left-auto md:w-[14vw] -rotate-6 z-10",
  },
  {
    src: '/hero/1.png',
    alt: 'Group 1',
    // Mobile: Bottom Right | Desktop: Far Right, shrunken
    className: "bottom-[-2vh] right-[-5vw] w-[70vw] rotate-2 md:bottom-[-1vh] md:right-[2vw] md:w-[22vw] z-20 scale-105",
  },
];

export default function Hero() {
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stickyRef.current) return;

    const ctx = gsap.context(() => {
      // Create a smooth fade-out using ScrollTrigger
      gsap.to(stickyRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div id="hero" className="w-full relative">
      
      {/* Sticky Content that stays fixed in place while scrolling */}
      <div
        ref={stickyRef}
        className="min-h-[100svh] sticky top-0 left-0 w-full flex flex-col justify-center items-center px-4 md:px-8 bg-gradient-to-br from-[#1b1e3e] via-[#4A55A2] to-[#7895CB] overflow-hidden [will-change:transform,opacity] [backface-visibility:hidden] [transform:translateZ(0)]"
      >
        {/* Optional Noise Overlay for texture */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        <div className="flex flex-col items-center text-center max-w-[95vw] md:max-w-7xl mx-auto pt-20 relative z-10 w-full">
          
          <h1 className="text-white font-averta-std font-normal text-[7vw] sm:text-4xl md:text-5xl lg:text-[5rem] tracking-wide leading-none uppercase drop-shadow-sm">
            GİRİŞİMCİ İNSANLAR
          </h1>
          
          <h2 className="text-white font-averta-std font-black text-[11vw] sm:text-6xl md:text-[5.5rem] lg:text-[8.5rem] tracking-tighter leading-[0.9] uppercase drop-shadow-md lg:-mt-2">
            OLARAK BÜYÜYORUZ
          </h2>

          <div className="relative z-20 w-full flex justify-center md:justify-end md:pr-[15%] lg:pr-[20%] -mt-4 md:-mt-8 lg:-mt-12">
            <span className="text-[#FFD100] font-cabin-sketch text-[11vw] sm:text-6xl md:text-[7rem] lg:text-[9rem] lowercase -rotate-[8deg] inline-block transform origin-center drop-shadow-xl">
              birlikte
            </span>
          </div>

          <div className="mt-8 md:mt-16 text-white/80 font-averta-std text-sm tracking-widest lowercase">
            daha fazlası için kaydır
          </div>
        </div>
        
        {/* Responsive Organic Illustrations */}
        <div className="absolute inset-x-0 bottom-0 w-full h-full pointer-events-none overflow-hidden z-20">
          {ILLUSTRATIONS.map((illu, idx) => (
            <img 
              key={idx}
              src={illu.src}
              alt={illu.alt}
              className={`absolute transition-all duration-700 ease-out h-auto object-contain drop-shadow-2xl ${illu.className}`}
            />
          ))}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-[#1b1e3e] to-transparent z-30 pointer-events-none"></div>
      </div>

      {/* The Clouds will scroll naturally right below the sticky container, creating the desired parallax overlap effect. */}
      <Clouds />

    </div>
  );
}
