"use client"

import React, { useEffect } from "react"
import Image from "next/image"
import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.js"
import "@fancyapps/ui/dist/fancybox/fancybox.css"

import { photoGalleryItems } from "@/config/photo-gallery"

export default function PhotoGallery() {
  useEffect(() => {
    Fancybox.bind("[data-fancybox='photo-gallery']", {})
    return () => Fancybox.destroy()
  }, [])

  return (
    <section className="w-full py-20 md:py-28 px-4 md:px-8 lg:px-16" id="photo-gallery">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-averta-std font-black uppercase tracking-tighter mb-4 text-black">
          Galeriden Kareler
        </h2>
        <div className="w-16 h-1 bg-[#0534c7] rounded-full mb-4 mx-auto" />
        <p className="max-w-2xl mx-auto text-gray-500 text-sm md:text-base font-averta-std">
          GİTBİ'den anlar — büyütmek için tıkla.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
        {photoGalleryItems.map((item, index) => (
          <a
            key={`${item.image}-${index}`}
            href={item.image}
            data-fancybox="photo-gallery"
            data-caption={item.title}
            className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-gray-100"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </a>
        ))}
      </div>
    </section>
  )
}
