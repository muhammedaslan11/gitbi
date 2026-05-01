"use client"

import { useState, useEffect } from "react"
import { DAYS, Day, timeToMinutes } from "@/lib/shift-utils"
import { teamItems } from "@/config/team"
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
      try { setSlots(JSON.parse(savedSlots)) } catch { /* ignore */ }
    }
  }, [])

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
    if (!name.trim()) { setError("Lütfen isminizi seçin"); return }
    if (slots.length === 0) { setError("En az bir müsaitlik ekleyin"); return }
    setIsSaving(true)
    try {
      await onSave(name.trim(), slots)
      localStorage.setItem("gitbi-shift-name", name.trim())
      localStorage.setItem("gitbi-shift-slots", JSON.stringify(slots))
    } catch {
      setError("Kaydedilirken bir hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const inputBase = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-[#0a0a0a] text-sm placeholder:text-black/20 focus:border-[#0035d5] focus:ring-1 focus:ring-[#0035d5]/20 transition-all outline-none"
  const labelBase = "block text-[9px] text-black/30 uppercase font-black tracking-[0.2em] mb-1.5"

  return (
    <div className="space-y-6">

      {/* Kimsin — dropdown */}
      <div>
        <label className={labelBase}>Kimsin</label>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`${inputBase} text-base font-semibold`}
        >
          <option value="">İsim seçin...</option>
          {teamItems.map((member) => (
            <option key={member.title} value={member.title} className="bg-white">
              {member.title}
            </option>
          ))}
        </select>
      </div>

      {/* Slot ekleme */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#0035d5] text-white text-[9px] font-black flex items-center justify-center shrink-0">
            01
          </span>
          <h3 className="text-xs font-averta-std font-black text-black/50 uppercase tracking-wider">
            Müsait Olduğum Saatler
          </h3>
        </div>

        {/* Gün */}
        <div>
          <label className={labelBase}>Gün</label>
          <select
            value={currentSlot.day}
            onChange={(e) => setCurrentSlot({ ...currentSlot, day: e.target.value as Day })}
            className={inputBase}
          >
            {DAYS.map((d) => (
              <option key={d} value={d} className="bg-white">{d}</option>
            ))}
          </select>
        </div>

        {/* Başlangıç */}
        <div>
          <label className={labelBase}>Başlangıç</label>
          <input
            type="time"
            value={currentSlot.start}
            onChange={(e) => setCurrentSlot({ ...currentSlot, start: e.target.value })}
            className={inputBase}
          />
        </div>

        {/* Bitiş */}
        <div>
          <label className={labelBase}>Bitiş</label>
          <input
            type="time"
            value={currentSlot.end}
            onChange={(e) => setCurrentSlot({ ...currentSlot, end: e.target.value })}
            className={inputBase}
          />
        </div>

        <button
          onClick={addSlot}
          className="w-full py-3 rounded-lg border border-dashed border-gray-200 text-black/30 hover:text-black/60 hover:border-gray-300 active:scale-[0.98] transition-all font-averta-std font-black uppercase tracking-widest text-[10px]"
        >
          + Listeye Ekle
        </button>
      </div>

      {/* Slot listesi */}
      {slots.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-[#0035d5] text-white text-[9px] font-black flex items-center justify-center shrink-0">
              02
            </span>
            <h3 className="text-xs font-averta-std font-black text-black/50 uppercase tracking-wider">
              Müsaitlik Listesi
            </h3>
          </div>

          <div className="grid gap-2">
            {slots.map((s, i) => (
              <div
                key={i}
                className="group flex items-center justify-between px-3.5 py-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0035d5]/10 flex items-center justify-center text-[#0035d5] shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[9px] text-black/30 font-black uppercase tracking-widest">{s.day}</div>
                    <div className="text-sm font-bold text-[#0a0a0a]">{s.start} – {s.end}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeSlot(i)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-red-400/50 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hata & Kaydet */}
      <div className="flex flex-col items-center gap-3 pt-2">
        {error && (
          <p className={`${error.includes("bulundu") ? "text-[#0035d5]" : "text-red-500"} text-[10px] font-black uppercase tracking-[0.2em] text-center`}>
            {error}
          </p>
        )}
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full h-12 text-white font-averta-std font-black uppercase tracking-[0.15em] text-xs"
        >
          {isSaving ? "Gönderiliyor..." : "Tümünü Gönder"}
        </Button>
      </div>
    </div>
  )
}
