"use client"
import { useEffect, useState } from "react"

import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { createPortal } from "react-dom"

import { hamburgerIcon, logo, navItems } from "@/config/marginals"

import Typography from "../Typography"

const SCROLL_OFFSET = 80
const handleScrollToSection = (href: string) => {
  if (href.startsWith("/#")) {
    const targetId = href.substring(2)
    const currentPage = window.location.pathname
    if (currentPage !== "/") window.location.href = "/#" + targetId
    const element = document.getElementById(targetId)
    if (element) {
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - SCROLL_OFFSET

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  } else if (href.startsWith("/")) {
    window.location.href = href
  } else {
    window.location.href = href
  }
}

function DesktopNavbar() {
  return (
    <div className="hidden relative lg:flex w-full items-center justify-between py-3">
      <div className="absolute left-0 h-full flex items-center">
        <Link href={logo.href}>
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="brightness-0 invert"
          />
        </Link>
      </div>
      <div className="h-full flex justify-center mx-auto">
        <div className="flex gap-[5vw] w-full justify-center">
          {navItems.map((item: { name: string; href: string }) => (
            <button
              key={item.name}
              onClick={(e) => {
                e.preventDefault()
                handleScrollToSection(item.href)
              }}
              className="transition-opacity hover:opacity-70 cursor-pointer"
            >
              <Typography.P className="!text-xs md:!text-sm mb-0 text-center font-averta-std font-medium text-white transition-colors duration-300 tracking-[0.15em] uppercase">
                {item.name}
              </Typography.P>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MobileNavbar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <div className="flex lg:hidden w-full items-center justify-between h-full">
        <div>
          <Link href={logo.href}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="brightness-0 invert"
            />
          </Link>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-[60] transition-colors duration-300 relative"
        >
          {isOpen ? (
            <X size={32} className="text-white" />
          ) : (
            <Image
              src={hamburgerIcon.src}
              alt={hamburgerIcon.alt}
              width={hamburgerIcon.width}
              height={hamburgerIcon.height}
              className="brightness-0 invert"
            />
          )}
        </button>
      </div>
      {isMounted
        ? createPortal(
            <div
              className={`fixed inset-0 bg-black z-[200] flex flex-col px-4 transition-all duration-500 ease-in-out lg:hidden ${
                isOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-10 pointer-events-none"
              }`}
            >
              <div className="w-full flex items-center justify-between py-6">
                <Link href={logo.href} onClick={() => setIsOpen(false)}>
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className="brightness-0 invert"
                  />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="transition-colors duration-300"
                  aria-label="Menüyü kapat"
                >
                  <X size={32} className="text-white" />
                </button>
              </div>

              <div className="flex-1 w-full flex flex-col justify-center items-center space-y-8">
                {navItems.map((item: { name: string; href: string }) => (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault()
                      handleScrollToSection(item.href)
                      setIsOpen(false)
                    }}
                    className="transition-transform active:scale-95 group"
                  >
                    <Typography.P className="text-white text-3xl font-averta-std font-semibold text-center group-hover:text-primary transition-colors tracking-widest uppercase">
                      {item.name}
                    </Typography.P>
                  </button>
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[80%] xl:w-[1000px] transition-all duration-500 ease-out"
      style={{ mixBlendMode: isOpen ? "normal" : "difference" }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 py-2">
        <DesktopNavbar />
        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  )
}
