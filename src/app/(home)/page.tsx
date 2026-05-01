"use client"
import React, { useEffect } from "react"

import About from "@/components/about/about"
import AsciiLogger from "@/components/ASCII/ASCIIlog"
import { FaqList } from "@/components/faq/faq-list"
import Gallery from "@/components/gallery/gallery"
import Hero from "@/components/hero/hero"
import Stats from "@/components/stats/stats"
import Testimonials from "@/components/testimonials/testimonials"
import { Timeline } from "@/components/timeline/timeline"
import ScrollMarquee from "@/components/ui/marquee"

export default function Home() {
  useEffect(() => {
    fetch("/api/clue")
      .then((res) => res.json())
      .then(() => console.warn("help me pleaseee!"))
  }, [])

  return (
    <>
      <Hero />
      <About />
      <Stats />
      <div className="bg-on-black">
        <Gallery />
      </div>
      <div className="bg-white overflow-hidden">
        <ScrollMarquee />
        <Timeline />
      </div>

      <div className="bg-on-black">
        <Testimonials />
        <div className="py-20">
          <ScrollMarquee />
        </div>
        <FaqList />
      </div>
      <div className="bg-white">
        <ScrollMarquee />
      </div>
      <AsciiLogger />
    </>
  )
}
