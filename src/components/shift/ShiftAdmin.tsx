"use client"

import { useState, useMemo, useEffect } from "react"
import { DAYS, timeToMinutes, DAY_START, DAY_END, getPercentage, getWidthPercentage } from "@/lib/shift-utils"
import Button from "@/components/ui/button"

interface Participant {
  id: string
  name: string
  slots: { day: string; start: string; end: string }[]
}

interface ShiftAdminProps {
  participants: Participant[]
}

export default function ShiftAdmin({ participants }: ShiftAdminProps) {
  const [selectedRange, setSelectedRange] = useState<{ day: string; range: string; members: string[] } | null>(null)

  // Hour labels: every 2 hours for readability
  const hours = useMemo(() => {
    const arr = []
    for (let h = DAY_START; h < DAY_END; h += 2) {
      arr.push(`${String(h).padStart(2, "0")}:00`)
    }
    return arr
  }, [])

  const getOverlapData = useMemo(() => {
    const allRangesByDay: Record<string, any[]> = {}

    DAYS.forEach(day => {
      const slots = participants.flatMap(p =>
        p.slots.filter(s => s.day === day).map(s => ({ ...s, name: p.name }))
      )
      if (slots.length === 0) { allRangesByDay[day] = []; return }

      const points = new Set<number>()
      slots.forEach(s => { points.add(timeToMinutes(s.start)); points.add(timeToMinutes(s.end)) })
      const sortedPoints = Array.from(points).sort((a, b) => a - b)
      const ranges: any[] = []

      for (let i = 0; i < sortedPoints.length - 1; i++) {
        const start = sortedPoints[i], end = sortedPoints[i + 1]
        const mid = (start + end) / 2
        const active = slots.filter(s => timeToMinutes(s.start) <= mid && timeToMinutes(s.end) >= mid).map(s => s.name)
        if (active.length > 0) {
          const fmt = (m: number) => `${Math.floor(m / 60).toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}`
          ranges.push({ day, start: fmt(start), end: fmt(end), startMin: start, count: active.length, members: active })
        }
      }

      const merged: any[] = []
      if (ranges.length > 0) {
        let cur = ranges[0]
        for (let i = 1; i < ranges.length; i++) {
          const nxt = ranges[i]
          if (cur.end === nxt.start && cur.count === nxt.count && [...cur.members].sort().join() === [...nxt.members].sort().join()) {
            cur.end = nxt.end
          } else { merged.push(cur); cur = nxt }
        }
        merged.push(cur)
      }

      allRangesByDay[day] = merged.map(r => {
        const duration = timeToMinutes(r.end) - timeToMinutes(r.start)
        return { ...r, duration, score: r.count * duration }
      })
    })

    const flat = DAYS.flatMap(day => allRangesByDay[day])
    // Sort by count (priority) and then by duration
    const sorted = [...flat].sort((a, b) => b.count - a.count || b.duration - a.duration)
    const winner = sorted.length > 0 ? { ...sorted[0], range: `${sorted[0].start}–${sorted[0].end}` } : null
    
    const alternatives = flat
      .filter(r => r.count > 1)
      .filter(r => !(winner && r.day === winner.day && r.start === winner.start && r.end === winner.end))
      .sort((a, b) => b.count - a.count || b.duration - a.duration)
      .slice(0, 2)

    return { allRangesByDay, winner, alternatives }
  }, [participants])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="p-8 rounded-full bg-gray-50 border border-dashed border-gray-200">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-black/20">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          </svg>
        </div>
        <p className="text-black/30 font-averta-std text-sm uppercase tracking-widest text-center">Henüz veri girilmedi</p>
      </div>
    )
  }

  const { winner, alternatives, allRangesByDay } = getOverlapData

  return (
    <div className="space-y-8">

      <div className="grid md:grid-cols-3 gap-4">
        {/* Winner card */}
        <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.5em]">En Uygun Toplantı Zamanı</p>
          <div className="w-8 h-0.5 bg-[#0035d5]/30 rounded-full" />
          {winner ? (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <span className="text-4xl md:text-5xl font-averta-std font-black text-[#0a0a0a] uppercase leading-none">{winner.day}</span>
                <span className="text-xl md:text-2xl font-averta-std font-black text-[#0035d5]">{winner.range}</span>
              </div>
              <p className="text-[10px] text-black/30 font-black uppercase tracking-[0.2em]">{winner.count} kişi müsait</p>
            </div>
          ) : (
            <p className="text-lg font-averta-std font-black text-black/20 uppercase">Çakışma bekleniyor</p>
          )}
        </div>

        {/* Alternatives side card */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 md:p-6 flex flex-col gap-4">
          <p className="text-[8px] font-black text-black/20 uppercase tracking-[0.3em]">Alternatifler</p>
          <div className="space-y-2">
            {alternatives.length > 0 ? (
              alternatives.map((alt, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedRange({ day: alt.day, range: `${alt.start}–${alt.end}`, members: alt.members })}
                  className="p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:border-[#0035d5]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-[#0a0a0a] uppercase">{alt.day}</span>
                    <span className="text-[8px] font-bold text-[#0035d5]">{alt.count} Kişi</span>
                  </div>
                  <div className="text-xs font-bold text-black/40 group-hover:text-[#0035d5] transition-colors">{alt.start} – {alt.end}</div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center">
                <p className="text-[9px] font-bold text-black/10 uppercase italic">Alternatif bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal calendar */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden" data-lenis-prevent>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">

            {/* Hour header row */}
            <div className="flex border-b border-gray-100 bg-gray-50">
              <div className="w-28 shrink-0 px-3 py-2" />
              <div className="flex-1 relative h-8">
                {hours.map((hour, i) => (
                  <div
                    key={hour}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[9px] font-black text-black/25 uppercase select-none"
                    style={{ left: `${((i * 2) / (DAY_END - DAY_START)) * 100}%` }}
                  >
                    {hour}
                  </div>
                ))}
                {/* End label */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-full text-[9px] font-black text-black/25 uppercase select-none" style={{ left: '100%' }}>
                  {String(DAY_END).padStart(2, '0')}:00
                </div>
              </div>
            </div>

            {/* Day rows */}
            {DAYS.map((day, dayIdx) => {
              const daySlots = participants.flatMap(p =>
                p.slots.filter(s => s.day === day).map(s => ({ ...s, name: p.name }))
              )
              const isWinnerDay = winner?.day === day
              const altHighlights = alternatives.filter(a => a.day === day)

              return (
                <div
                  key={day}
                  className={`flex border-b border-gray-100 last:border-b-0 ${dayIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                >
                  {/* Day label */}
                  <div className="w-28 shrink-0 flex items-center px-3 py-2">
                    <span className="text-[10px] font-black text-black/40 uppercase leading-tight">{day}</span>
                  </div>

                  {/* Time track */}
                  <div className="flex-1 relative h-14 overflow-hidden">
                    {/* Hour grid lines */}
                    {Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute inset-y-0 w-px bg-gray-100"
                        style={{ left: `${(i / (DAY_END - DAY_START)) * 100}%` }}
                      />
                    ))}

                    {/* All merged availability ranges */}
                    {allRangesByDay[day]?.map((range: any, idx: number) => {
                      const isWinner = winner && winner.day === day && winner.start === range.start && winner.end === range.end
                      const width = getWidthPercentage(range.start, range.end)
                      const isAlternative = alternatives.some(a => a.day === day && a.start === range.start && a.end === range.end)
                      
                      return (
                        <div
                          key={idx}
                          className={`absolute inset-y-0 border-l rounded-sm cursor-pointer transition-all flex items-center px-1.5 overflow-hidden group/range
                            ${isWinner 
                              ? "bg-[#0035d5]/30 border-[#0035d5] z-30" 
                              : isAlternative 
                                ? "bg-[#0035d5]/15 border-[#0035d5]/50 z-20" 
                                : "bg-[#0035d5]/5 border-[#0035d5]/10 z-10 hover:bg-[#0035d5]/10"
                            }`}
                          style={{
                            left: `${getPercentage(range.start)}%`,
                            width: `${width}%`,
                          }}
                          onClick={() => setSelectedRange({ day, range: `${range.start}–${range.end}`, members: range.members })}
                        >
                          <div className="flex flex-wrap gap-x-1 items-center leading-none">
                            {isWinner && width > 15 && (
                              <span className="text-[7px] font-black text-[#0035d5] uppercase mr-1 bg-[#0035d5]/10 px-1 rounded-sm">ORTAK</span>
                            )}
                            
                            {range.members.length > 2 && width < 20 ? (
                              <span className="text-[6px] font-black text-[#0035d5]/60 uppercase whitespace-nowrap">
                                {range.members[0].split(' ')[0]} +{range.members.length - 1}
                              </span>
                            ) : width < 10 ? (
                              <span className="text-[6px] font-black text-[#0035d5]/60 uppercase">+{range.members.length}</span>
                            ) : (
                              range.members.map((m: string, mIdx: number) => (
                                <span key={mIdx} className="text-[6px] font-black text-[#0035d5]/60 uppercase whitespace-nowrap">
                                  {m.split(' ')[0]}{mIdx < range.members.length - 1 ? ',' : ''}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRange && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
          <div
            className="bg-white border border-gray-100 rounded-2xl p-8 md:p-10 w-full max-w-lg shadow-2xl space-y-8 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <h4 className="font-averta-std font-black text-[#0a0a0a] text-4xl md:text-6xl uppercase leading-none">{selectedRange.day}</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0035d5] rounded-full" />
                <p className="text-base text-[#0035d5] font-averta-std font-black uppercase tracking-[0.15em]">{selectedRange.range}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.4em]">Müsait Ekip</p>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {selectedRange.members.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-[#0035d5]/40 shrink-0" />
                    <span className="text-sm font-bold text-black/60">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setSelectedRange(null)} className="w-full h-11 text-white font-averta-std font-black uppercase tracking-[0.2em] text-xs">
              Kapat
            </Button>
          </div>
        </div>
      )}

      {/* Participants list */}
      <div className="flex flex-col items-center gap-5 pt-6 border-t border-gray-100">
        <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.4em]">Kayıtlı Katılımcılar</p>
        <div className="flex flex-wrap justify-center gap-2">
          {[...participants].sort((a, b) => a.name.localeCompare(b.name)).map(p => (
            <div key={p.id} className="h-9 flex items-center px-5 bg-gray-50 border border-gray-100 rounded-full">
              <span className="text-[11px] font-bold text-black/40">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
