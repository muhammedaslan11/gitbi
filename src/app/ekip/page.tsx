"use client"

import React, { useState, useEffect } from "react"
import { Typography } from "@/components"
import Image from "next/image"
import InfiniteMenu from "@/components/ui/infinite-menu"
import { teamItems, teamPageContent } from "@/config/team"
import { motion, AnimatePresence } from "motion/react"

const TeamCard = ({
  item,
  index,
}: {
  item: (typeof teamItems)[0]
  index: number
}) => {
  const paddedIndex = (index + 1).toString().padStart(2, "0")

  // Separate role and status: "Role | Status"
  const parts = item.description.split("|")
  const roleBadge = parts[0].trim().toUpperCase()
  const statusText = parts[1] ? parts[1].trim() : "GİTBİ Üyesi"

  return (
    <div className="group relative flex flex-col bg-black/40 border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
        {/* Dark overlay at the bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
      </div>

      {/* Info Section */}
      <div className="p-3 sm:p-5 flex flex-col gap-1 sm:gap-2 relative z-10">
        <div className="flex justify-between items-center mb-1">
          <span className="text-2xl font-bold font-mono text-white/20 group-hover:text-white/40 transition-colors">
            {paddedIndex}
          </span>
          <div className="px-2 py-0.5 border border-[#3B82F6] text-[#3B82F6] text-[10px] font-bold tracking-widest uppercase">
            {roleBadge}
          </div>
        </div>

        <h3 className="text-base sm:text-xl font-bold text-white tracking-tight uppercase group-hover:text-[#3B82F6] transition-colors">
          {item.title}
        </h3>
        <p className="text-xs text-gray-400 font-medium leading-relaxed">
          {statusText}
        </p>
      </div>
    </div>
  )
}

export default function EkipPage() {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("grid")
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (viewMode === "3d") {
      setShowHint(true)
      timer = setTimeout(() => setShowHint(false), 4500)
    } else {
      setShowHint(false)
    }
    return () => clearTimeout(timer)
  }, [viewMode])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* View Toggle Switch */}
      <div className="fixed bottom-12 md:bottom-auto md:top-28 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 lg:right-16 z-50 flex bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2.5 rounded-full transition-all duration-300 ${
            viewMode === "grid"
              ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30"
              : "text-gray-400 hover:text-white"
          }`}
          aria-label="Kart Görünümü"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="7" height="7" x="3" y="3" rx="1"></rect>
            <rect width="7" height="7" x="14" y="3" rx="1"></rect>
            <rect width="7" height="7" x="14" y="14" rx="1"></rect>
            <rect width="7" height="7" x="3" y="14" rx="1"></rect>
          </svg>
        </button>
        <button
          onClick={() => setViewMode("3d")}
          className={`p-2.5 rounded-full transition-all duration-300 ${
            viewMode === "3d"
              ? "bg-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/30"
              : "text-gray-400 hover:text-white"
          }`}
          aria-label="3D Görünüm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </button>
      </div>

      {viewMode === "3d" ? (
        <div 
          className="fixed inset-0 w-screen h-screen overflow-hidden text-white flex flex-col items-center justify-center z-40 bg-on-black"
          onPointerDown={() => setShowHint(false)}
        >
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-all duration-500"
              >
                <div className="flex flex-col items-center justify-center gap-8 -mt-20">
                  {/* Finger Animation */}
                  <motion.div
                    animate={{
                      x: [0, -60, 60, 0],
                      rotate: [0, -15, 15, 0],
                      scale: [1, 1.1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-white relative"
                  >
                    {/* Glow behind hand */}
                    <div className="absolute inset-0 bg-[#3B82F6]/30 blur-2xl rounded-full scale-150"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="72"
                      height="72"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                    >
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                  </motion.div>
                  
                  {/* Text */}
                  <motion.div
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-white text-2xl md:text-3xl font-bold tracking-wider drop-shadow-xl text-center uppercase">
                      Dokun ve Gezdir
                    </p>
                    <div className="h-0.5 w-16 bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full mb-1"></div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title Overlay for 3D */}
          <div className="absolute top-28 md:top-36 left-0 w-full z-10 pointer-events-none text-center px-4">
            <Typography.H1 className="font-normal font-wc-rough-trad text-[#f2f3f7] text-[clamp(2.5rem,4vw,5rem)] drop-shadow-lg">
              {teamPageContent.title3d}
            </Typography.H1>
            <p className="max-w-2xl mx-auto text-gray-300 mt-2 drop-shadow-md">
              {teamPageContent.subtitle3d}
            </p>
          </div>

          {/* Fullscreen Canvas Container */}
          <div className="absolute inset-0 w-full h-full z-0">
            <InfiniteMenu items={teamItems} scale={0.9} initialTargetIndex={0} />
          </div>
        </div>
      ) : (
        <div className="min-h-screen w-full relative z-40 pt-32 pb-20 px-4 md:px-8 lg:px-16 overflow-y-auto bg-black">
          {/* Header Section for Grid */}
          <div className="max-w-7xl mx-auto mb-16 text-center mt-12 md:mt-4">
            <Typography.H1 className="font-normal font-wc-rough-trad text-[#f2f3f7] text-[clamp(2.5rem,6vw,5rem)] drop-shadow-lg mb-4">
              {teamPageContent.titleGrid}
            </Typography.H1>
            <div className="w-24 h-1 bg-[#3B82F6] mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl">
              {teamPageContent.subtitleGrid}
            </p>
          </div>

          {/* Grid Section */}
          <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 md:gap-8 pb-10">
            {teamItems.map((item, index) => (
              <TeamCard key={index} item={item} index={index} />
            ))}
          </div>
          {/* Spotify Section */}
          <div className="max-w-4xl mx-auto mt-20 md:mt-32 mb-10 px-4">
            <div className="flex flex-col items-center text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-averta-std font-black uppercase tracking-tighter mb-4">
                Ekibin Favori Şarkıları
              </h2>
              <div className="w-16 h-1 bg-[#3B82F6] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] mb-4" />
              <p className="text-gray-400 text-sm md:text-base uppercase tracking-widest font-medium">
                Mutfakta neler dinliyoruz?
              </p>
            </div>
            
            <div className="relative group p-1 rounded-[16px] bg-gradient-to-br from-[#3B82F6]/20 to-transparent hover:from-[#3B82F6]/40 transition-all duration-500 shadow-2xl">
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/5TW7i3ewK43yR5Q4ITwbPd?utm_source=generator&theme=0" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                className="shadow-inner"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
