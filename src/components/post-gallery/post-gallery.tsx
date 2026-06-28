"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Clapperboard, Image as ImageIcon } from "lucide-react"

import { postGalleryItems } from "@/config/post-gallery"

export default function PostGallery() {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setCanScrollPrev(track.scrollLeft > 4)
    setCanScrollNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4)
  }, [])

  useEffect(() => {
    updateScrollState()
    const track = trackRef.current
    if (!track) return
    track.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)
    return () => {
      track.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [updateScrollState])

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLLIElement>("[data-pg-card]")
    const amount = (card?.offsetWidth ?? 280) + 24
    track.scrollBy({ left: direction * amount, behavior: "smooth" })
  }

  return (
    <section className="w-full py-20 md:py-28 px-4 md:px-8 lg:px-16" id="post-gallery">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-averta-std font-black uppercase tracking-tighter mb-4 text-black">
          Sosyal Medya İçeriklerimiz
        </h2>
        <div className="w-16 h-1 bg-[#0534c7] rounded-full mb-4 mx-auto" />
        <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base font-averta-std">
          Ajans içinden kareler, başarı hikâyeleri ve yaratıcı kampanya örnekleri sosyal medya hesaplarımızda!
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <ul
          ref={trackRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {postGalleryItems.map((item, index) => (
            <li
              key={`${item.link}-${index}`}
              data-pg-card
              className="snap-start shrink-0 w-[200px] sm:w-[260px]"
            >
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[9/16] w-full overflow-hidden rounded-xl bg-gray-100"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 w-7 h-7 rounded-md bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
                  {item.type === "reel" ? (
                    <Clapperboard size={16} />
                  ) : (
                    <ImageIcon size={16} />
                  )}
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            aria-label="Önceki gönderi"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollPrev}
            className="w-11 h-11 rounded-full bg-[#0534c7] text-white flex items-center justify-center transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label="Sonraki gönderi"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollNext}
            className="w-11 h-11 rounded-full bg-[#FFD100] text-black flex items-center justify-center transition-opacity duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
