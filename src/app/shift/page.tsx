"use client"

import { useState, useEffect } from "react"
import confetti from "canvas-confetti"
import ShiftForm from "@/components/shift/ShiftForm"
import ShiftAdmin from "@/components/shift/ShiftAdmin"
import Button from "@/components/ui/button"

type View = "form" | "success" | "results" | "welcome"

export default function ShiftPage() {
  const [view, setView] = useState<View>("form")
  const [participants, setParticipants] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userName, setUserName] = useState<string | null>(null)

  const fetchParticipants = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/shift")
      const data = await res.json()
      if (Array.isArray(data)) setParticipants(data)
    } catch (error) {
      console.error("Failed to fetch participants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const savedName = localStorage.getItem("gitbi-shift-name")
    if (savedName) {
      const exists = participants.some(p => p.name === savedName)
      if (exists) {
        setUserName(savedName)
        setView("welcome")
      } else {
        // Sync mismatch: DB was likely cleared
        localStorage.removeItem("gitbi-shift-name")
        localStorage.removeItem("gitbi-shift-slots")
        setUserName(null)
        setView("form")
      }
    }
  }, [participants, isLoading])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [view])

  const handleSave = async (name: string, slots: any[]) => {
    const res = await fetch("/api/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slots }),
    })

    if (res.ok) {
      await fetchParticipants()
      localStorage.setItem("gitbi-shift-name", name)
      localStorage.setItem("gitbi-shift-slots", JSON.stringify(slots))
      setView("success")
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#0035d5", "#0534c7", "#ffffff"],
      })
    } else {
      throw new Error("Save failed")
    }
  }

  return (
    <main
      className="min-h-[100dvh] bg-white text-[#0a0a0a] relative z-40 pt-6 md:pt-10 pb-[calc(env(safe-area-inset-bottom,16px)+32px)] px-4 md:px-8 lg:px-16 overflow-x-clip"
    >
      {/* Subtle background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-[10%] w-[50vw] h-[50vw] bg-[#0035d5]/10 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">

        {/* Header */}
        <header className={`mb-6 md:mb-8 text-center transition-all duration-700 ${view === "results" ? "opacity-0 h-0 overflow-hidden mb-0" : "opacity-100"}`}>
          <h1 className="font-wc-rough-trad text-[#0a0a0a] text-[clamp(2rem,9vw,4rem)] leading-none mb-2 uppercase">
            Kulüp <span className="text-[#0534c7]">Shift</span>
          </h1>
          <div className="w-10 h-0.5 bg-[#0035d5]/40 mx-auto mb-2 rounded-full" />
          <p className="text-black/30 text-[10px] font-averta-std font-bold uppercase tracking-[0.25em]">
            Toplantı saati planlama sistemi
          </p>
        </header>

        {/* Welcome */}
        {view === "welcome" && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div>
                <h2 className="font-averta-std font-black text-[#0a0a0a] text-2xl md:text-4xl uppercase mb-2">
                  Tekrar Selam{userName ? `, ${userName.split(" ")[0]}` : ""}!
                </h2>
                <p className="font-averta-std text-black/40 text-sm">Kaydın zaten mevcut. Ne yapmak istersin?</p>
              </div>
              <div className="flex flex-col gap-3 w-full pt-2">
                <Button
                  onClick={() => setView("results")}
                  className="w-full h-12 text-white font-averta-std font-black uppercase tracking-[0.15em] text-xs"
                >
                  Toplantı Tablosuna Bak
                </Button>
                <button
                  onClick={() => setView("form")}
                  className="w-full h-12 border border-gray-200 rounded-xl text-black/40 font-averta-std font-bold uppercase tracking-[0.15em] text-xs hover:bg-gray-50 transition-all"
                >
                  Müsaitliğimi Düzenle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {view === "form" && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="w-10 h-10 border-2 border-[#0035d5]/20 border-t-[#0035d5] rounded-full animate-spin" />
                <p className="text-black/30 text-[10px] font-averta-std font-black uppercase tracking-[0.3em]">Yükleniyor</p>
              </div>
            ) : (
              <ShiftForm onSave={handleSave} participants={participants} />
            )}
          </div>
        )}

        {/* Success */}
        {view === "success" && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-14 h-14 bg-[#0035d5]/10 rounded-full flex items-center justify-center border border-[#0035d5]/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#0035d5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="font-averta-std font-black text-[#0a0a0a] text-2xl md:text-4xl uppercase mb-2">Harikasın!</h2>
                <p className="font-averta-std text-black/40 text-sm max-w-xs mx-auto">Müsaitliğin kaydedildi. Ekibin tablosuna göz at.</p>
              </div>
              <div className="flex flex-col gap-3 w-full pt-2">
                <Button
                  onClick={() => setView("results")}
                  className="w-full h-12 text-white font-averta-std font-black uppercase tracking-[0.15em] text-xs"
                >
                  Haftalık Tabloya Bak
                </Button>
                <button
                  onClick={() => setView("form")}
                  className="text-black/20 hover:text-black/50 font-averta-std font-bold text-[10px] uppercase tracking-[0.3em] transition-all"
                >
                  Geri Dön ve Düzenle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {view === "results" && (
          <div>
            <div className="mb-6 flex items-start justify-between">
              {/* Back Button */}
              <button 
                onClick={() => setView(userName ? "welcome" : "form")}
                className="flex items-center gap-2 text-black/20 hover:text-black/60 transition-all group py-1"
              >
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-gray-200 group-hover:bg-white transition-all shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-0.5 transition-transform">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Geri Dön</span>
              </button>

              <div className="text-right">
                <h2 className="font-averta-std font-black text-[#0a0a0a] text-2xl md:text-3xl uppercase leading-none">Analiz</h2>
                <p className="text-[#0035d5]/70 text-[9px] font-bold uppercase tracking-[0.25em] mt-0.5">Ekip Müsaitlik Haritası</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 md:p-8">
              <ShiftAdmin participants={participants} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="h-px w-10 bg-black/10" />
          <span className="font-cabin-sketch text-xl text-[#0035d5]/60 -rotate-1">birlikte büyüyoruz</span>
          <span className="font-averta-std text-[9px] font-black uppercase tracking-[0.5em] text-black/15">GİTBİ &bull; 2026</span>
        </div>
      </div>
    </main>
  )
}
