"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Music, History, Trophy, Mic2, X, ExternalLink, Disc } from "lucide-react"

interface Song {
  title: string
  artist: string
  artwork: string
  count?: number
}

interface Artist {
  artist: string
  count: number
}

interface MusicStats {
  history: Song[]
  topSongs: Song[]
  topArtists: Artist[]
  monthlyCount: number
}

const cleanName = (name: string) => name.replace(/\n/g, '').replace(/\s+/g, ' ').trim()

const USER_ID = "00a82266-93eb-47c7-aaab-f4f008f21f60"
const API_BASE = "https://api.music.baransel.site/api/stats"

export default function ProfessorMusic() {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState<MusicStats | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/${USER_ID}?t=${Date.now()}`)
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch music stats:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && !stats) {
      fetchStats()
    }
  }, [isOpen])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative transition-all duration-500 hover:scale-105 active:scale-95"
      >
        <motion.span 
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="font-averta-std text-[10px] font-black uppercase tracking-[0.6em] text-white group-hover:text-[#3B82F6] transition-colors duration-500"
        >
          Pişerken ne dinleniyor?
        </motion.span>
        {/* Subtle persistent hint underline */}
        <div className="absolute -bottom-1 left-0 w-full h-px border-b border-white/[0.05] border-dashed group-hover:border-[#3B82F6]/40 group-hover:border-solid transition-all duration-500" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-[#3B82F6]" />
                    <h2 className="font-wc-rough-trad text-3xl md:text-5xl text-white uppercase tracking-tighter leading-none">
                      Professor
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-all group"
                >
                  <X className="w-5 h-5 text-white/40 group-hover:text-white" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-12">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6">
                    <div className="w-12 h-12 border-2 border-[#3B82F6]/20 border-t-[#3B82F6] rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.5em] animate-pulse">Veriler Çekiliyor</p>
                  </div>
                ) : stats ? (
                  <>
                    {/* Monthly Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 relative bg-gradient-to-br from-[#3B82F6]/10 to-transparent p-8 rounded-[32px] border border-[#3B82F6]/20 flex items-center gap-8">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#3B82F6] blur-2xl opacity-20" />
                          <div className="relative w-24 h-24 rounded-full border-4 border-[#3B82F6] flex items-center justify-center bg-black">
                            <span className="text-3xl font-black text-white">{stats.monthlyCount}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-white uppercase tracking-tighter">BU AY TOPLAM</h3>
                          <p className="text-[#3B82F6] font-black text-sm uppercase tracking-widest">DİNLENEN ŞARKI</p>
                        </div>
                      </div>

                      <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[32px] flex flex-col justify-center text-center">
                        <Trophy className="w-8 h-8 text-[#FFD100] mx-auto mb-4" />
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Favori Sanatçı</h4>
                        <p className="text-xl font-black text-white uppercase truncate">
                          {stats.topArtists[0]?.artist || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Top Songs */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Trophy className="w-5 h-5 text-[#FFD100]" />
                        <h3 className="text-lg font-black text-white uppercase tracking-widest">En Çok Dinlenenler</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.topSongs.map((song, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-[#3B82F6]/30 transition-all group">
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 relative bg-black/40">
                              <img src={song.artwork} alt={song.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white font-black text-sm">#{i + 1}</span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black text-[#3B82F6] opacity-50 group-hover:opacity-100 transition-opacity">#{i + 1}</span>
                                <p className="text-sm font-bold text-white truncate">{song.title}</p>
                              </div>
                              <p className="text-[11px] text-white/40 truncate">{cleanName(song.artist)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent & Artists Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Recently Played */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <History className="w-5 h-5 text-[#3B82F6]" />
                          <h3 className="text-lg font-black text-white uppercase tracking-widest">Son Dinlenenler</h3>
                        </div>
                        <div className="space-y-3">
                          {stats.history.slice(0, 5).map((song, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                <img src={song.artwork} alt={song.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{song.title}</p>
                                <p className="text-[11px] text-white/40 truncate">{cleanName(song.artist)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Artists */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <Mic2 className="w-5 h-5 text-[#3B82F6]" />
                          <h3 className="text-lg font-black text-white uppercase tracking-widest">En Sevilenler</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          {stats.topArtists.map((artist, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 rounded-[24px] bg-white/[0.02] border border-white/5 hover:bg-[#3B82F6]/5 transition-all">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-transparent flex items-center justify-center shrink-0 border-2 border-white/10 overflow-hidden">
                                <Mic2 className="w-6 h-6 text-white/20" />
                              </div>
                              <div className="flex-1">
                                <p className="text-lg font-black text-white uppercase tracking-tight">{artist.artist}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="h-1 bg-[#3B82F6]/20 flex-1 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(artist.count / stats.topArtists[0].count) * 100}%` }}
                                      className="h-full bg-[#3B82F6]" 
                                    />
                                  </div>
                                  <span className="text-[10px] font-black text-white/30">{artist.count} DİNLEME</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-white/20 font-black uppercase tracking-widest">Veri bulunamadı</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </>
  )
}
