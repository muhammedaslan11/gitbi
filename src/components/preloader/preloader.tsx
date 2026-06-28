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
                <div className="flex items-center text-white select-none">
                    <span className="font-sketch-block font-normal text-6xl md:text-8xl leading-none">
                        GIT
                    </span>
                    <span className="font-grutch-shaded font-normal text-6xl md:text-8xl leading-none">
                        B!
                    </span>
                </div>
            }
        />
    );
};

export default Preloader;
