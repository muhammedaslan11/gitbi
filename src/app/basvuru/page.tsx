'use client';

import React, { useState } from 'react';
import TransitionScribble from '@/components/ui/transition-scribble';
import confetti from 'canvas-confetti';

export default function BasvuruPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
    university: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/basvuru', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('success');
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0534c7', '#2f5df0', '#ffffff'],
        });
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Bir hata oluştu.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Ağ hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-white flex items-center justify-center py-20 px-6">
      <TransitionScribble autoRun={true} />
      
      {/* Subtle Blue Glow Background - Refined for Light Theme */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-grutch-shaded text-6xl md:text-8xl text-primary tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Gitbi&apos;ye Katıl
          </h1>
          <p className="font-averta-std text-gray-400 text-sm md:text-base uppercase tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            Geleceği birlikte inşa edelim
          </p>
        </div>

        {status === 'success' ? (
          <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-12 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-averta-std font-black text-gray-900 text-3xl mb-4 uppercase tracking-tight">BAŞVURUN ALINDI!</h2>
              <p className="font-averta-std text-gray-500 text-lg mb-8">
                Ekibimiz başvurunu inceledikten sonra seninle en kısa sürede iletişime geçecek.
              </p>
              <button 
                onClick={() => setStatus('idle')}
                className="font-averta-std font-bold text-sm tracking-widest text-primary hover:text-primary-dark transition-colors uppercase"
              >
                Yeni Başvuru Yap
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="font-averta-std font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] pl-1">
                  Ad Soyad
                </label>
                <input
                  required
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ahmet Çınar"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-averta-std text-gray-900 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-averta-std font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] pl-1">
                    E-posta
                  </label>
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ahmetcinar@mail.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-averta-std text-gray-900 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="font-averta-std font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] pl-1">
                    Telefon
                  </label>
                  <input
                    required
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="05..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-averta-std text-gray-900 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="university" className="font-averta-std font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] pl-1">
                    Üniversite / Şirket
                  </label>
                  <input
                    required
                    type="text"
                    id="university"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Örn: İTÜ veya Gitbi"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-averta-std text-gray-900 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="department" className="font-averta-std font-bold text-gray-400 text-[10px] uppercase tracking-[0.2em] pl-1">
                    Bölüm / Rol
                  </label>
                  <input
                    required
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Örn: Bilgisayar Mühendisliği"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 font-averta-std text-gray-900 focus:outline-none focus:border-primary/50 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-300"
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-red-500/80 font-averta-std text-sm font-semibold">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className={`
                  mt-4 w-full bg-primary text-white font-averta-std font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-sm
                  transition-all active:scale-[0.98] shadow-lg shadow-primary/20
                  hover:bg-primary-light hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                  ${status === 'loading' ? 'animate-pulse' : ''}
                `}
              >
                {status === 'loading' ? 'Gönderiliyor...' : 'ŞİMDİ BAŞVUR'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
