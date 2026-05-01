"use client"

import { useState, useRef, useEffect } from "react"
import Button from "@/components/ui/button"

interface ShiftAuthProps {
  onAuthenticated: () => void
}

export default function ShiftAuth({ onAuthenticated }: ShiftAuthProps) {
  const [code, setCode] = useState(["", "", "", ""])
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const inputs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newCode = [...code]
    newCode[index] = value.slice(-1)
    setCode(newCode)
    setError(null)

    // Move to next input if value is entered
    if (value && index < 3) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  const verifyPassword = async (fullCode: string) => {
    setIsVerifying(true)
    try {
      const res = await fetch("/api/shift/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: fullCode }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        localStorage.setItem("gitbi-shift-auth", "true")
        onAuthenticated()
      } else {
        setError(data.message || "Hatalı şifre")
        setCode(["", "", "", ""])
        inputs.current[0]?.focus()
      }
    } catch (err) {
      setError("Sunucuya bağlanılamadı")
    } finally {
      setIsVerifying(false)
    }
  }

  useEffect(() => {
    const fullCode = code.join("")
    if (fullCode.length === 4) {
      verifyPassword(fullCode)
    }
  }, [code])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in fade-in zoom-in duration-700">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-[#0035d5]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#0035d5]/20 shadow-inner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0035d5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h2 className="font-averta-std font-black text-[#0a0a0a] text-2xl md:text-3xl uppercase tracking-tight">Giriş Gerekli</h2>
        <p className="font-averta-std text-black/30 text-[10px] font-bold uppercase tracking-[0.3em]">Devam etmek için 4 haneli kodu girin</p>
      </div>

      <div className="flex gap-3 md:gap-4">
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`w-14 h-18 md:w-16 md:h-20 text-center text-3xl font-black rounded-2xl border-2 transition-all outline-none
              ${error 
                ? "border-red-500 bg-red-50 text-red-500 animate-shake" 
                : "border-gray-100 bg-gray-50 text-[#0035d5] focus:border-[#0035d5] focus:bg-white focus:shadow-lg focus:shadow-[#0035d5]/10"
              }`}
            disabled={isVerifying}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-[9px] font-black uppercase tracking-[0.2em] animate-in fade-in duration-300 px-8 text-center">{error}</p>
      )}

      {isVerifying && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-[#0035d5]/20 border-t-[#0035d5] rounded-full animate-spin" />
          <span className="text-[9px] font-black text-black/20 uppercase tracking-[0.2em]">Doğrulanıyor...</span>
        </div>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}
