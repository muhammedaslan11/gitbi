"use client"

import { useState, useEffect } from "react"

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"] as const
type Day = (typeof DAYS)[number]
type Status = "Müsait Değil" | "Ders Var"

interface Slot {
  day: Day
  start: string
  end: string
  status: Status
}
interface Person {
  name: string
  slots: Slot[]
}

const DAY_START = 8
const DAY_END = 22
const TOTAL_MIN = (DAY_END - DAY_START) * 60
const RULER_HOURS = [8, 10, 12, 14, 16, 18, 20, 22]

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}
function pct(t: string) {
  return ((toMin(t) - DAY_START * 60) / TOTAL_MIN) * 100
}
function widthPct(start: string, end: string) {
  return ((toMin(end) - toMin(start)) / TOTAL_MIN) * 100
}

function freeRanges(day: Day, people: Person[]): string[] {
  const daySlots = people.flatMap((p) => p.slots.filter((s) => s.day === day))
  if (!daySlots.length) return []

  const busy = new Array(TOTAL_MIN).fill(false)
  for (const s of daySlots) {
    const st = Math.max(0, toMin(s.start) - DAY_START * 60)
    const en = Math.min(TOTAL_MIN, toMin(s.end) - DAY_START * 60)
    for (let i = st; i < en; i++) busy[i] = true
  }

  const ranges: string[] = []
  let start: number | null = null
  for (let i = 0; i <= TOTAL_MIN; i++) {
    const isBusy = i < TOTAL_MIN ? busy[i] : true
    if (!isBusy && start === null) start = i
    if (isBusy && start !== null) {
      const s = DAY_START * 60 + start
      const e = DAY_START * 60 + i
      if (e - s >= 30) {
        const fmt = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`
        ranges.push(`${fmt(s)}–${fmt(e)}`)
      }
      start = null
    }
  }
  return ranges
}

export default function ShiftPage() {
  const [tab, setTab] = useState<"form" | "admin">("form")
  const [people, setPeople] = useState<Person[]>([])

  const [name, setName] = useState("")
  const [slots, setSlots] = useState<Slot[]>([])
  const [slotDay, setSlotDay] = useState<Day>("Pazartesi")
  const [slotStart, setSlotStart] = useState("09:00")
  const [slotEnd, setSlotEnd] = useState("10:00")
  const [slotStatus, setSlotStatus] = useState<Status>("Müsait Değil")
  const [saveMsg, setSaveMsg] = useState("")

  useEffect(() => {
    const d = localStorage.getItem("shift-people")
    if (d) setPeople(JSON.parse(d))
  }, [])

  function persist(p: Person[]) {
    setPeople(p)
    localStorage.setItem("shift-people", JSON.stringify(p))
  }

  function addSlot() {
    if (toMin(slotEnd) <= toMin(slotStart)) {
      alert("Bitiş saati başlangıçtan sonra olmalı")
      return
    }
    setSlots([...slots, { day: slotDay, start: slotStart, end: slotEnd, status: slotStatus }])
  }

  function handleSave() {
    if (!name.trim()) {
      alert("Ad Soyad girin")
      return
    }
    const updated = people.filter((p) => p.name.toLowerCase() !== name.trim().toLowerCase())
    persist([...updated, { name: name.trim(), slots }])
    setName("")
    setSlots([])
    setSaveMsg("Kaydedildi ✓")
    setTimeout(() => setSaveMsg(""), 2000)
  }

  const totalSlots = people.reduce((a, p) => a + p.slots.length, 0)
  const activeDays = new Set(people.flatMap((p) => p.slots.map((s) => s.day))).size
  const daysWithSlots = DAYS.filter((d) => people.some((p) => p.slots.some((s) => s.day === d)))

  const inputCls =
    "border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Shift</h1>
        <p className="text-sm text-gray-500 mb-6">Müsaitlik Takip Sistemi</p>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-gray-200">
          {(["form", "admin"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "form" ? "Müsaitlik Gir" : "Admin Panel"}
            </button>
          ))}
        </div>

        {/* ── FORM TAB ── */}
        {tab === "form" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Ad Soyad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mehmet Yılmaz"
                className={inputCls}
                style={{ width: "260px" }}
              />
              <p className="text-xs text-gray-400 mt-1">
                Aynı isimle tekrar kaydetmek üzerine yazar.
              </p>
            </div>

            {/* Slot ekleme kutusu */}
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
              }}
            >
              <p className="text-sm font-medium text-gray-700 mb-3">Slot Ekle</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Gün</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value as Day)}
                    className={inputCls}
                  >
                    {DAYS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Başlangıç</label>
                  <input
                    type="time"
                    value={slotStart}
                    onChange={(e) => setSlotStart(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Bitiş</label>
                  <input
                    type="time"
                    value={slotEnd}
                    onChange={(e) => setSlotEnd(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Durum</label>
                  <select
                    value={slotStatus}
                    onChange={(e) => setSlotStatus(e.target.value as Status)}
                    className={inputCls}
                  >
                    <option>Müsait Değil</option>
                    <option>Ders Var</option>
                  </select>
                </div>
                <button
                  onClick={addSlot}
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 16px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                >
                  + Ekle
                </button>
              </div>
            </div>

            {/* Slot listesi */}
            {slots.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Eklenen Slotlar ({slots.length})
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {slots.map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "8px 12px",
                        background: "#fff",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ fontWeight: 600, width: "90px" }}>{s.day}</span>
                      <span style={{ color: "#4b5563" }}>
                        {s.start} – {s.end}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          background: s.status === "Müsait Değil" ? "#fee2e2" : "#ffedd5",
                          color: s.status === "Müsait Değil" ? "#b91c1c" : "#c2410c",
                        }}
                      >
                        {s.status}
                      </span>
                      <button
                        onClick={() => setSlots(slots.filter((_, idx) => idx !== i))}
                        style={{
                          marginLeft: "auto",
                          color: "#9ca3af",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "16px",
                          lineHeight: 1,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kaydet */}
            <div>
              <button
                onClick={handleSave}
                style={{
                  background: saveMsg ? "#16a34a" : "#15803d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                {saveMsg || "Kaydet"}
              </button>
            </div>
          </div>
        )}

        {/* ── ADMIN TAB ── */}
        {tab === "admin" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Özet kartları */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              {[
                { label: "Kişi", value: people.length },
                { label: "Toplam Slot", value: totalSlots },
                { label: "Aktif Gün", value: activeDays },
              ].map((c) => (
                <div
                  key={c.label}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "36px", fontWeight: 700, color: "#2563eb" }}>
                    {c.value}
                  </div>
                  <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                    {c.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Ekip listesi */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-3">Ekip</h2>
              {people.length === 0 ? (
                <p className="text-sm text-gray-400">Henüz kayıt yok.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {people.map((p) => (
                    <div
                      key={p.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid #e5e7eb",
                        borderRadius: "6px",
                        padding: "8px 14px",
                        fontSize: "14px",
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 600 }}>{p.name}</span>
                        <span style={{ color: "#9ca3af", fontSize: "12px", marginLeft: "8px" }}>
                          {p.slots.length} slot
                        </span>
                      </div>
                      <button
                        onClick={() => persist(people.filter((x) => x.name !== p.name))}
                        style={{
                          fontSize: "12px",
                          color: "#dc2626",
                          border: "1px solid #fecaca",
                          borderRadius: "4px",
                          padding: "2px 10px",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Günlük zaman haritası */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-1">Günlük Zaman Haritası</h2>
              <div style={{ display: "flex", gap: "8px", marginBottom: "8px", paddingLeft: "100px" }}>
                {RULER_HOURS.map((h) => (
                  <span
                    key={h}
                    style={{
                      flex: 1,
                      fontSize: "10px",
                      color: "#9ca3af",
                      textAlign: "center",
                    }}
                  >
                    {h}:00
                  </span>
                ))}
              </div>

              {daysWithSlots.length === 0 && (
                <p className="text-sm text-gray-400">Henüz veri yok.</p>
              )}

              {daysWithSlots.map((day) => (
                <div key={day} style={{ marginBottom: "12px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#374151",
                      marginBottom: "4px",
                    }}
                  >
                    {day}
                  </p>
                  {people
                    .filter((p) => p.slots.some((s) => s.day === day))
                    .map((p) => (
                      <div
                        key={p.name}
                        style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            color: "#6b7280",
                            width: "92px",
                            flexShrink: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {p.name}
                        </span>
                        <div
                          style={{
                            position: "relative",
                            flex: 1,
                            height: "22px",
                            background: "#f3f4f6",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          {p.slots
                            .filter((s) => s.day === day)
                            .map((s, i) => (
                              <div
                                key={i}
                                title={`${s.start}–${s.end} · ${s.status}`}
                                style={{
                                  position: "absolute",
                                  left: `${pct(s.start)}%`,
                                  width: `${widthPct(s.start, s.end)}%`,
                                  top: 0,
                                  bottom: 0,
                                  background:
                                    s.status === "Müsait Değil" ? "#ef4444" : "#f97316",
                                  borderRadius: "2px",
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))}

              {/* Renk açıklaması */}
              {daysWithSlots.length > 0 && (
                <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                  {(["Müsait Değil", "Ders Var"] as Status[]).map((s) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "2px",
                          background: s === "Müsait Değil" ? "#ef4444" : "#f97316",
                        }}
                      />
                      <span style={{ fontSize: "11px", color: "#6b7280" }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Herkesin müsait olduğu saatler */}
            <div>
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Herkesin Müsait Olduğu Saatler
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Kimsenin slot girmediği temiz zaman aralıkları
              </p>
              {people.length === 0 ? (
                <p className="text-sm text-gray-400">Henüz veri yok.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {DAYS.map((day) => {
                    const ranges = freeRanges(day, people)
                    if (!ranges.length) return null
                    return (
                      <div key={day} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            width: "92px",
                            color: "#374151",
                          }}
                        >
                          {day}
                        </span>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {ranges.map((r) => (
                            <span
                              key={r}
                              style={{
                                background: "#dcfce7",
                                color: "#15803d",
                                fontSize: "12px",
                                fontWeight: 600,
                                padding: "2px 10px",
                                borderRadius: "4px",
                              }}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {DAYS.every((d) => freeRanges(d, people).length === 0) && (
                    <p className="text-sm text-gray-400">Tüm saatlerde en az bir slot var.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
