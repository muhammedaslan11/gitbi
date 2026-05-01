import Image from "next/image"
import Link from "next/link"

import { Typography } from "@/components"
import { FOOTER_TEXT, SOCIALS, navItems } from "@/config/marginals"

export default function Footer() {

  return (
    <footer
      id="footer"
      className="relative w-full flex flex-col justify-end mt-24 md:mt-32 lg:mt-48 xl:mt-64 bg-white"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mt-4 mb-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm sm:text-base font-prompt font-medium text-black/80 hover:text-black transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
      {/* Social Links */}
      <div className="flex w-full justify-center items-center gap-6 lg:gap-10 sm:gap-8 md:gap-12">
        {SOCIALS.map((social) => (
          <Link
            key={social.name}
            href={social.href}
            className="flex items-center gap-2 text-black hover:opacity-75 transition-opacity"
          >
            <Image
              src={social.icon}
              alt={social.name}
              width={40}
              height={40}
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-8 lg:h-8 xl:w-10 xl:h-10"
            />
            <Typography.P className="hidden sm:block font-prompt my-auto text-sm font-medium text-black">
              {social.name.toUpperCase()}
            </Typography.P>
          </Link>
        ))}
      </div>

      {/* Main Logo Section */}
      <div className="w-full flex items-center justify-center relative">
        <div className="relative flex items-center justify-center">
          {/* Desktop Logo Layout */}
          <div className="hidden lg:flex items-center gap-6 relative">
            <Typography.Display className="text-center font-sketch-block font-normal text-primary text-[16vw] xl:text-[14vw] 2xl:text-[12vw] leading-none">
              GIT
            </Typography.Display>
            <Typography.Display className="text-center font-grutch-shaded font-normal text-[16vw] xl:text-[14vw] 2xl:text-[12vw] leading-none">
              B!
            </Typography.Display>
          </div>

          {/* Mobile Logo Layout */}
          <div className="flex lg:hidden flex-col items-center relative mt-8">
            <Typography.Display className="text-center font-sketch-block font-normal text-primary text-[28vw] sm:text-[24vw] md:text-[20vw] leading-none">
              GIT
            </Typography.Display>
            <Typography.Display className="text-center font-grutch-shaded font-normal text-[28vw] sm:text-[24vw] md:text-[20vw] leading-none -mt-2">
              B!
            </Typography.Display>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <Typography.Lead className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-black text-center mt-5">
        {FOOTER_TEXT}
      </Typography.Lead>
    </footer>
  )
}
