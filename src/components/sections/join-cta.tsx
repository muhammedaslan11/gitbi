"use client"

import { motion } from "framer-motion"
import { ArrowRight, Users } from "lucide-react"
import Link from "next/link"

import { JOIN_LINK } from "@/config/marginals"

import Typography from "../Typography"

export default function JoinCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background visual element */}
      <div className="absolute inset-0 bg-blue-600/5 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/20 rounded-full blur-[160px] -z-10 opacity-30" />

      {/* Blueprint lines logic similar to other sections if exists */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white/5 border border-white/10 rounded-[3rem] p-10 md:p-20 overflow-hidden text-center backdrop-blur-sm">
          {/* Blueprint Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center justify-center size-16 bg-primary/20 text-primary rounded-2xl mb-8">
              <Users className="size-8" />
            </div>

            <Typography.H2 className="!text-4xl md:!text-6xl font-bold mb-6 tracking-tight">
              Sıradaki Büyük Şeyi <br />
              <span className="text-primary italic">Birlikte</span> İnşa Edelim
            </Typography.H2>

            <Typography.P className="!text-lg md:!text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Girişimcilik, teknoloji ve inovasyon dünyasına adım at. GİTBİ
              ailesine katıl ve potansiyelini gerçeğe dönüştür.
            </Typography.P>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href={JOIN_LINK} className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto px-10 py-5 bg-primary text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <div className="relative flex items-center justify-center gap-3">
                    <span className="text-xl">Hemen Başvur</span>
                    <ArrowRight className="size-6 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </Link>

              <Typography.P className="text-white/40 font-medium">
                Sadece birkaç dakikanı alır.
              </Typography.P>
            </div>
          </motion.div>

          {/* Decorative Corner Accents */}
          <div className="absolute top-0 right-0 p-8">
            <div className="w-20 h-20 border-t-2 border-r-2 border-white/5 rounded-tr-3xl" />
          </div>
          <div className="absolute bottom-0 left-0 p-8">
            <div className="w-20 h-20 border-b-2 border-l-2 border-white/5 rounded-bl-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
