"use client"

import { useState, useMemo, useEffect } from "react"
import { DAYS, Day, timeToMinutes, DAY_START, DAY_END, getPercentage, getWidthPercentage } from "@/lib/shift-utils"
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
  const [selectedRange, setSelectedRange] = useState<{ day: string, range: string, members: string[] } | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    // Artificial AI analysis delay for premium feel
    const timer = setTimeout(() => setIsAnalyzing(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const hours = useMemo(() => {
    const arr = []
    for (let h = DAY_START; h <= DAY_END; h++) {
      arr.push(`${String(h).padStart(2, "0")}:00`)
    }
    return arr
  }, [])

  // Advanced Overlap Algorithm
  const getOverlapData = useMemo(() => {
    const allRangesByDay: Record<string, any[]> = {}
    let maxOverallCount = 0

    DAYS.forEach(day => {
      const slots = participants.flatMap(p => 
        p.slots.filter(s => s.day === day).map(s => ({ ...s, name: p.name }))
      )
      if (slots.length === 0) {
        allRangesByDay[day] = []
        return
      }
      const points = new Set<number>()
      slots.forEach(s => {
        points.add(timeToMinutes(s.start))
        points.add(timeToMinutes(s.end))
      })
      const sortedPoints = Array.from(points).sort((a, b) => a - b)
      const ranges: any[] = []
      for (let i = 0; i < sortedPoints.length - 1; i++) {
        const start = sortedPoints[i]
        const end = sortedPoints[i+1]
        const mid = (start + end) / 2
        const activeParticipants = slots.filter(s => timeToMinutes(s.start) <= mid && timeToMinutes(s.end) >= mid).map(s => s.name)
        if (activeParticipants.length > 0) {
          const startTimeStr = `${Math.floor(start/60).toString().padStart(2,'0')}:${(start%60).toString().padStart(2,'0')}`
          const endTimeStr = `${Math.floor(end/60).toString().padStart(2,'0')}:${(end%60).toString().padStart(2,'0')}`
          ranges.push({ day, start: startTimeStr, end: endTimeStr, startMin: start, count: activeParticipants.length, members: activeParticipants })
          if (activeParticipants.length > maxOverallCount) maxOverallCount = activeParticipants.length
        }
      }
      const merged: any[] = []
      if (ranges.length > 0) {
        let current = ranges[0]
        for (let i = 1; i < ranges.length; i++) {
          const next = ranges[i]
          const currentMembers = [...current.members].sort().join(',')
          const nextMembers = [...next.members].sort().join(',')
          if (current.end === next.start && current.count === next.count && currentMembers === nextMembers) {
            current.end = next.end
          } else {
            merged.push(current)
            current = next
          }
        }
        merged.push(current)
      }
      allRangesByDay[day] = merged
    })

    let absoluteWinner: any = null
    if (maxOverallCount > 0) {
      for (const day of DAYS) {
        const winnersOnDay = allRangesByDay[day].filter(r => r.count === maxOverallCount).sort((a, b) => a.startMin - b.startMin)
        if (winnersOnDay.length > 0) {
          absoluteWinner = { ...winnersOnDay[0], range: `${winnersOnDay[0].start}–${winnersOnDay[0].end}` }
          break
        }
      }
    }
    const alternatives = DAYS.flatMap(day => allRangesByDay[day])
      .filter(r => r.count > 1)
      .filter(r => !(absoluteWinner && r.day === absoluteWinner.day && r.start === absoluteWinner.start && r.end === absoluteWinner.end))
      .sort((a, b) => b.count - a.count || DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.startMin - b.startMin)
      .slice(0, 2)
    return { allRangesByDay, maxOverallCount, absoluteWinner, alternatives }
  }, [participants])

  const bestSlots = useMemo(() => getOverlapData.absoluteWinner ? [getOverlapData.absoluteWinner] : [], [getOverlapData])

  const calculateLayout = (day: string) => {
    const slots = participants.flatMap(p => p.slots.filter(s => s.day === day).map(s => ({ ...s, name: p.name, startMin: timeToMinutes(s.start), endMin: timeToMinutes(s.end) }))).sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin)
    const columns: any[][] = []
    slots.forEach(slot => {
      let placed = false
      for (let i = 0; i < columns.length; i++) {
        if (slot.startMin >= columns[i][columns[i].length - 1].endMin) {
          columns[i].push(slot)
          placed = true
          break
        }
      }
      if (!placed) columns.push([slot])
    })
    const results: any[] = []
    columns.forEach((col, colIdx) => col.forEach(slot => results.push({ ...slot, width: 100 / columns.length, left: (colIdx * 100) / columns.length })))
    return results
  }

  const sortedParticipants = useMemo(() => [...participants].sort((a, b) => a.name.localeCompare(b.name)), [participants])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="p-8 rounded-full bg-white/5 border border-dashed border-white/20">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
        </div>
        <p className="text-white/30 font-averta-std text-sm uppercase tracking-widest text-center">Henüz veri girilmedi</p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Top Highlight Box with Minimalist AI Shimmer */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="relative bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-12 flex flex-col items-center gap-6 text-center overflow-hidden min-h-[220px] justify-center">
            
            <>
              <div className="space-y-1">
                <h3 className="font-averta-std font-black text-white/20 text-[9px] uppercase tracking-[0.5em]">En Uygun Toplantı Zamanı</h3>
                <div className="w-8 h-0.5 bg-[#007f00]/30 mx-auto rounded-full" />
              </div>
              
              {bestSlots.length > 0 ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-700">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <span className="text-5xl md:text-8xl font-wc-rough-trad text-white uppercase leading-none tracking-tight drop-shadow-2xl">{bestSlots[0].day}</span>
                    <span className="text-2xl md:text-4xl font-averta-std font-black text-[#007f00] px-4 py-2">
                      {bestSlots[0].range}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                     <div className="h-px w-8 bg-white/5" />
                     <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{bestSlots[0].count} KİŞİ MÜSAİT</p>
                     <div className="h-px w-8 bg-white/5" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4 animate-in fade-in duration-700">
                  <p className="text-xl md:text-2xl font-averta-std font-black text-white/40 uppercase tracking-tighter">Çakışma Bekleniyor</p>
                  <p className="text-[9px] text-[#3B82F6]/60 font-black uppercase tracking-[0.3em]">Yeni veriler analiz edildiğinde burada belirecek.</p>
                </div>
              )}
            </>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative pt-10 px-2 md:px-6 bg-black/20 rounded-[40px] border border-white/5 pb-12 overflow-x-auto custom-scrollbar">
        <div className="min-w-[1400px]">
          <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-4 mb-8">
            <div />
            {DAYS.map(day => (
              <div key={day} className="text-center">
                <span className="text-xs font-bold text-white/70 uppercase tracking-tighter">{day}</span>
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-[80px_repeat(7,1fr)] gap-4 h-[700px]">
            <div className="relative h-full flex flex-col justify-between text-[10px] font-black text-white/10 uppercase tracking-widest pr-4 py-1">
              {hours.map(hour => <div key={hour} className="h-0 flex items-center justify-end">{hour}</div>)}
            </div>

            {DAYS.map(day => {
              const layoutSlots = calculateLayout(day)
              const overlapRanges = getOverlapData.allRangesByDay[day]
              const winner = getOverlapData.absoluteWinner
              const alternativesOnDay = getOverlapData.alternatives.filter(alt => alt.day === day)
              const activeHighlights = []
              if (winner && winner.day === day) activeHighlights.push({ ...winner, isWinner: true })
              alternativesOnDay.forEach(alt => activeHighlights.push({ ...alt, isWinner: false }))

              return (
                <div key={day} className="relative h-full border-l border-white/[0.03] group">
                  <div className="absolute inset-y-0 left-0 w-px bg-white/[0.03] group-hover:bg-white/10 transition-colors" />
                  <div className="absolute inset-0 pointer-events-none">
                     {hours.map((_, i) => (
                       <div key={i} className="absolute w-full border-t border-white/[0.01]" style={{ top: `${(i / (hours.length - 1)) * 100}%` }} />
                     ))}
                  </div>

                  {/* Individual Availability */}
                  {layoutSlots.map((slot, idx) => (
                    <div
                      key={`ind-${idx}`}
                      className="absolute bg-[#3B82F6]/20 border-l border-[#3B82F6]/40 z-0 group/slot hover:bg-[#3B82F6]/30 transition-all rounded-sm"
                      style={{ top: `${getPercentage(slot.start)}%`, height: `${getWidthPercentage(slot.start, slot.end)}%`, left: `${slot.left}%`, width: `${slot.width - 0.5}%` }}
                    >
                      <div className="h-full w-full overflow-hidden flex flex-col p-1.5">
                         {slot.width > 15 && (
                           <span className="text-[9px] font-black text-white/60 uppercase tracking-tighter truncate group-hover/slot:text-white transition-colors">
                              {slot.name.split(' ')[0]}
                           </span>
                         )}
                      </div>
                    </div>
                  ))}

                  {/* Overlap Highlights */}
                  <div className="absolute inset-0 pointer-events-none z-10">
                    {activeHighlights.map((r, i) => {
                      const rangeStr = `${r.start}–${r.end}`
                      return (
                        <div
                          key={`overlap-${i}`}
                          className={`absolute inset-x-0 bg-gradient-to-r from-[#007f00]/20 to-transparent border-l-[4px] border-[#007f00] ${!r.isWinner ? 'border-dashed opacity-50' : 'shadow-[0_0_20px_rgba(74,222,128,0.1)]'} pointer-events-auto cursor-pointer flex items-center justify-center backdrop-blur-[1px] transition-all hover:from-[#007f00]/40`}
                          style={{ top: `${getPercentage(r.start)}%`, height: `${getWidthPercentage(r.start, r.end)}%` }}
                          onClick={() => setSelectedRange({ day, range: rangeStr, members: r.members })}
                        >
                           <div className="flex flex-col items-center">
                              <span className="text-[9px] font-black text-white/90 uppercase tracking-widest">{r.isWinner ? 'ORTAK' : 'ALTERNATİF'}</span>
                              <span className="text-[7px] font-bold text-white/40">{r.count} KİŞİ</span>
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

        {/* Modal */}
        {selectedRange && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
             <div 
               className="bg-[#121212] border border-white/10 rounded-[40px] md:rounded-[48px] p-8 md:p-12 w-full max-w-2xl shadow-2xl space-y-10 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]"
               onClick={(e) => e.stopPropagation()}
             >
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h4 className="font-wc-rough-trad text-white text-5xl md:text-7xl uppercase leading-none tracking-tighter">{selectedRange.day}</h4>
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-[#007f00] rounded-full animate-pulse shadow-[0_0_10px_#007f00]" />
                         <p className="text-base md:text-xl text-[#007f00] font-averta-std font-black uppercase tracking-[0.2em]">{selectedRange.range}</p>
                      </div>
                   </div>
                </div>
                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/5" />
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Müsait Olan Ekip Üyeleri</p>
                      <div className="h-px flex-1 bg-white/5" />
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      {selectedRange.members.map((name, idx) => (
                        <div key={idx} className="group relative">
                           <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3B82F6]/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                           <div className="relative flex items-center gap-3 px-5 py-4 bg-white/[0.03] border border-white/5 rounded-2xl group-hover:border-[#3B82F6]/30 transition-all">
                              <div className="w-2 h-2 rounded-full bg-[#3B82F6]/40 shrink-0" />
                              <span className="text-sm font-bold text-white/70 group-hover:text-white transition-colors">{name}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="pt-4"><Button onClick={() => setSelectedRange(null)} className="w-full h-18 text-white font-averta-std font-black uppercase tracking-[0.3em] text-sm shadow-2xl rounded-3xl">Kapat</Button></div>
             </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 pt-8 border-t border-white/5">
        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Kayıtlı Katılımcılar</p>
        <div className="flex flex-wrap justify-center gap-3">
          {[...participants].sort((a, b) => a.name.localeCompare(b.name)).map(p => (
            <div key={p.id} className="min-w-[100px] h-10 flex items-center justify-center px-6 bg-white/[0.03] border border-white/5 rounded-full"><span className="text-[11px] font-bold text-white/50">{p.name}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}
