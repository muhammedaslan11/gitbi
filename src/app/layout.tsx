import "./globals.css"

import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"

import HOC from "@/components/hoc/hoc"
import { metaDataObject } from "@/config/seo"
import {
  avertaStd,
  cabinSketch,
  grutchShaded,
  museo,
  sketchBlock,
  wcRoughTrad,
} from "@/fonts"

export const metadata = metaDataObject as Metadata

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={` ${avertaStd.variable} ${grutchShaded.variable} ${museo.variable} ${sketchBlock.variable} ${wcRoughTrad.variable} ${cabinSketch.variable} bg-[#000000] antialiased`}
      >
        <HOC>{children}</HOC>
        <Analytics />
      </body>
    </html>
  )
}
