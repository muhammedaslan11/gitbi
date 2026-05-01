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
  const [hasData, setHasData] = useState(false)

  const fetchParticipants = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/shift")
      const data = await res.json()
      if (Array.isArray(data)) {
        setParticipants(data)
      }
    } catch (error) {
      console.error("Failed to fetch participants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchParticipants()
    const name = localStorage.getItem("gitbi-shift-name")
    if (name) {
      setHasData(true)
      setView("welcome")
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
      setHasData(true)
      setView("success")
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#FFD100", "#ffffff"],
      })
    } else {
      throw new Error("Save failed")
    }
  }

  return (
    <main className="min-h-[100dvh] bg-on-black text-white relative z-40 pt-4 md:pt-6 pb-[calc(env(safe-area-inset-bottom,20px)+40px)] px-4 md:px-8 lg:px-16 overflow-x-hidden">
      {/* Background Decor (Glow) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[5%] left-[5%] w-[60vw] h-[60vw] bg-[#3B82F6]/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-[5%] right-[5%] w-[50vw] h-[50vw] bg-[#FFD100]/5 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className={`mb-8 md:mb-10 text-center transition-all duration-1000 ${view === 'results' ? 'opacity-0 h-0 overflow-hidden mb-0' : 'opacity-100'}`}>
          <h1 className="font-wc-rough-trad text-[#f2f3f7] text-[clamp(3.5rem,10vw,7rem)] drop-shadow-2xl leading-none mb-4 uppercase tracking-tight">
            Kulüp <span className="text-[#3B82F6]">Shift</span>
          </h1>
          <div className="w-24 h-1 bg-[#3B82F6] mx-auto mb-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
          <p className="max-w-xl mx-auto text-gray-400 text-base md:text-xl font-averta-std font-black uppercase tracking-tighter">
            Toplantı saati planlama sistemi
          </p>
        </header>

        <div className="relative group">
          {view === "welcome" && (
            <div className="max-w-2xl mx-auto relative bg-[#121212]/80 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 md:p-20 shadow-2xl text-center min-h-[60vh] flex flex-col justify-center">
              <div className="flex flex-col items-center gap-10">
                <div className="space-y-4">
                  <h2 className="font-averta-std font-black text-white text-4xl md:text-6xl uppercase tracking-tighter leading-none">Tekrar Selam!</h2>
                  <p className="font-averta-std text-gray-400 text-lg md:text-xl">Kaydın zaten mevcut. Ne yapmak istersin?</p>
                </div>
                
                <div className="flex flex-col gap-4 w-full pt-8">
                  <Button 
                    onClick={() => setView("results")}
                    className="w-full h-18 text-white font-averta-std font-black uppercase tracking-[0.2em] text-sm"
                  >
                    Toplantı Tablosuna Bak
                  </Button>
                  <button 
                    onClick={() => setView("form")}
                    className="w-full h-18 border border-white/10 rounded-2xl text-white/60 font-averta-std font-black uppercase tracking-[0.2em] text-sm hover:bg-white/5 transition-all"
                  >
                    Müsaitliğimi Düzenle
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === "form" && (
            <div className="relative bg-[#121212]/80 backdrop-blur-3xl border border-white/5 rounded-[40px] p-6 md:p-12 shadow-2xl">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-8">
                  <div className="w-16 h-16 border-4 border-[#3B82F6]/10 border-t-[#3B82F6] rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
                  <p className="text-[#3B82F6] text-sm font-averta-std font-black uppercase tracking-[0.4em] animate-pulse">Sistem Hazırlanıyor</p>
                </div>
              ) : (
                <ShiftForm onSave={handleSave} participants={participants} />
              )}
            </div>
          )}

          {view === "success" && (
            <div className="max-w-2xl mx-auto relative bg-[#121212]/80 backdrop-blur-3xl border border-white/5 rounded-[48px] p-12 md:p-20 shadow-2xl text-center min-h-[60vh] flex flex-col justify-center">
              <div className="flex flex-col items-center gap-10">
                <div className="w-24 h-24 bg-[#3B82F6]/10 rounded-full flex items-center justify-center border border-[#3B82F6]/30 shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-4">
                  <h2 className="font-averta-std font-black text-white text-4xl md:text-6xl uppercase tracking-tighter leading-none">Harikasın!</h2>
                  <p className="font-averta-std text-gray-400 text-lg md:text-xl">Müsaitliğin başarıyla kaydedildi. Şimdi ekibin haftalık tablosuna göz atabilirsin.</p>
                </div>
                
                <div className="flex flex-col gap-6 w-full pt-8">
                  <Button 
                    onClick={() => setView("results")}
                    className="w-full h-18 text-white font-averta-std font-black uppercase tracking-[0.2em] text-sm shadow-2xl"
                  >
                    Haftalık Tabloya Bak
                  </Button>
                  <button 
                    onClick={() => setView("form")}
                    className="text-white/20 hover:text-white/60 font-averta-std font-black text-[10px] uppercase tracking-[0.4em] transition-all"
                  >
                    Geri Dön ve Düzenle
                  </button>
                </div>
              </div>
            </div>
          )}

          {view === "results" && (
            <div>
               <div className="flex items-center justify-between mb-8 md:mb-10">
                  <button 
                    onClick={() => setView(hasData ? "welcome" : "form")}
                    className="flex items-center gap-4 text-white/30 hover:text-[#3B82F6] transition-all group"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#3B82F6]/30 group-hover:bg-[#3B82F6]/5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                    </div>
                    <span className="font-averta-std font-black text-[11px] uppercase tracking-[0.3em]">Geri Dön</span>
                  </button>
                  
                  <div className="text-right">
                     <h2 className="font-wc-rough-trad text-white text-4xl md:text-5xl uppercase leading-none drop-shadow-lg">Analiz</h2>
                     <p className="text-[#3B82F6] text-[10px] font-black uppercase tracking-[0.3em] mt-1">Ekip Müsaitlik Haritası</p>
                  </div>
               </div>
               
               <div className="bg-[#121212]/80 backdrop-blur-2xl border border-white/5 rounded-[40px] p-6 md:p-12 shadow-2xl border-t-white/10">
                 <ShiftAdmin participants={participants} />
               </div>
            </div>
          )}
        </div>

        {/* Minimal Footer Signature */}
        <div className="mt-16 flex flex-col items-center gap-6">
           <div className="h-px w-16 bg-white/10" />
           <span className="font-cabin-sketch text-3xl text-[#FFD100] -rotate-2 drop-shadow-lg">birlikte büyüyoruz</span>
           <span className="font-averta-std text-[10px] font-black uppercase tracking-[0.6em] text-white/20">GİTBİ KULÜBÜ &bull; 2026</span>
        </div>
      </div>
    </main>
  )
}
