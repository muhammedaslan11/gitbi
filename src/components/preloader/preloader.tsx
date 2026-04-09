'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import TransitionScribble from '../ui/transition-scribble';

const Preloader = () => {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [prevPathname, setPrevPathname] = useState(pathname);

    // Sayfa değiştiğini yakaladığımız an (dom güncellenmeden) animasyonu aktifleştir
    // Böylece flaş (yeni sayfanın saniyelik gözükmesi) sorunu olmadan yükleme ekranı çıkar
    if (pathname !== prevPathname) {
        setIsVisible(true);
        setPrevPathname(pathname);
    }

    if (!isVisible) return null;

    return (
        <TransitionScribble 
            key={pathname} // path değişince bileşeni tamamen baştan oluşturup çalıştırır
            autoRun={true} 
            onComplete={() => setIsVisible(false)}
            logo={
                <div className="flex flex-col items-center select-none font-bold">
                    <div 
                        className="text-6xl md:text-8xl tracking-[0.2em] leading-none"
                        style={{ fontFamily: 'var(--font-museo)', marginLeft: '0.2em' }}
                    >
                        GITB!
                    </div>
                </div>
            }
        />
    );
};

export default Preloader;
