"use client"

import { useState, useEffect } from "react"
import { DAYS, Day, timeToMinutes } from "@/lib/shift-utils"
import Button from "@/components/ui/button"

interface ShiftSlot {
  day: Day
  start: string
  end: string
}

interface ShiftFormProps {
  onSave: (name: string, slots: ShiftSlot[]) => Promise<void>
  participants: { name: string; slots: ShiftSlot[] }[]
}

export default function ShiftForm({ onSave, participants }: ShiftFormProps) {
  const [name, setName] = useState("")
  const [slots, setSlots] = useState<ShiftSlot[]>([])
  const [currentSlot, setCurrentSlot] = useState<ShiftSlot>({
    day: "Pazartesi",
    start: "09:00",
    end: "10:00",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedName = localStorage.getItem("gitbi-shift-name")
    const savedSlots = localStorage.getItem("gitbi-shift-slots")
    if (savedName) setName(savedName)
    if (savedSlots) {
      try {
        setSlots(JSON.parse(savedSlots))
      } catch (e) {
        console.error("Failed to parse saved slots", e)
      }
    }
  }, [])

  // Auto-sync logic: Stealthily pull data if name matches and form is empty
  useEffect(() => {
    if (!name.trim() || slots.length > 0) return

    const existing = participants.find(
      p => p.name.toLowerCase().trim() === name.toLowerCase().trim()
    )

    if (existing) {
      setSlots(existing.slots)
      setError("Eski kaydın bulundu, verilerin yüklendi. ⚡")
      setTimeout(() => setError(null), 3000)
    }
  }, [name, participants])

  const addSlot = () => {
    setError(null)
    if (timeToMinutes(currentSlot.end) <= timeToMinutes(currentSlot.start)) {
      setError("Bitiş saati başlangıçtan sonra olmalı")
      return
    }
    setSlots([...slots, currentSlot])
  }

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setError(null)
    if (!name.trim()) {
      setError("Lütfen adınızı girin")
      return
    }
    if (slots.length === 0) {
      setError("En az bir müsaitlik alanı eklemelisiniz")
      return
    }

    setIsSaving(true)
    try {
      await onSave(name.trim(), slots)
      localStorage.setItem("gitbi-shift-name", name.trim())
      localStorage.setItem("gitbi-shift-slots", JSON.stringify(slots))
    } catch (error) {
      setError("Kaydedilirken bir hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const inputStyle = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/50 transition-all outline-none"

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Kimlik Bölümü */}
      <div className="space-y-4">
        <label className="block text-[10px] font-averta-std font-black uppercase tracking-[0.3em] text-[#3B82F6]">
          Kimliğin
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="İsim Soyisim"
          className={`${inputStyle} text-lg md:text-xl font-bold`}
        />
      </div>

      {/* Giriş Alanı */}
      <div className="relative p-6 md:p-8 rounded-[24px] bg-white/5 border border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 hidden sm:block">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2v20M2 12h20" />
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-[10px] font-black shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            01
          </div>
          <h3 className="text-lg md:text-xl font-averta-std font-black text-white uppercase tracking-tighter">
            Müsait Olduğum Saatler ve Günler
          </h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">GÜN</label>
            <select
              value={currentSlot.day}
              onChange={(e) => setCurrentSlot({ ...currentSlot, day: e.target.value as Day })}
              className={inputStyle}
            >
              {DAYS.map((d) => (
                <option key={d} value={d} className="bg-black">{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">BAŞLANGIÇ</label>
            <input
              type="time"
              value={currentSlot.start}
              onChange={(e) => setCurrentSlot({ ...currentSlot, start: e.target.value })}
              className={inputStyle}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase font-black tracking-widest">BİTİŞ</label>
            <input
              type="time"
              value={currentSlot.end}
              onChange={(e) => setCurrentSlot({ ...currentSlot, end: e.target.value })}
              className={inputStyle}
            />
          </div>
        </div>

        <button
          onClick={addSlot}
          className="mt-8 w-full py-4 rounded-xl border-2 border-dashed border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] active:scale-95 transition-all font-averta-std font-black uppercase tracking-widest text-[10px]"
        >
          + Listeye Ekle
        </button>
      </div>

      {/* Liste Alanı */}
      {slots.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-[#FFD100] flex items-center justify-center text-[10px] font-black text-black shrink-0 shadow-[0_0_15px_rgba(255,209,0,0.3)]">
              02
            </div>
            <h3 className="text-lg md:text-xl font-averta-std font-black text-white uppercase tracking-tighter">
              Müsaitlik Listesi (Taslak)
            </h3>
          </div>
          
          <div className="grid gap-3">
            {slots.map((s, i) => (
              <div
                key={i}
                className="group flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-[#3B82F6]/30 transition-all"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{s.day}</span>
                    <span className="text-base md:text-lg font-bold text-white tracking-tight">{s.start} – {s.end}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeSlot(i)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 flex flex-col items-center gap-4">
        {error && (
          <p className={`${error.includes('bulundu') ? 'text-blue-400' : 'text-red-500'} text-[10px] font-black uppercase tracking-[0.2em] animate-pulse text-center`}>
            {error}
          </p>
        )}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-80 h-14 text-white font-averta-std font-black uppercase tracking-[0.2em] text-sm shadow-xl"
        >
          {isSaving ? "Gönderiliyor..." : "Tümünü Gönder"}
        </Button>
      </div>
    </div>
  )
}
