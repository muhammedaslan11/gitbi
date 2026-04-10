'use client';

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { gsap } from 'gsap';

export interface TransitionScribbleHandle {
    runAnimation: () => void;
}

interface TransitionScribbleProps {
    logo?: React.ReactNode;
    colors?: string[];
    config?: {
        strokeWidthStart: string;
        strokeWidthMax: string;
        scale: number;
        durationIn: number;
        durationOut: number;
        delayMiddle?: number;
    };
    autoRun?: boolean;
    onComplete?: () => void;
}

const DEFAULT_CONFIG = {
    strokeWidthStart: "8%",
    strokeWidthMax: "31%",
    scale: 1, // Tam ekran olması için 1 yapıldı (eski değer: 0.7)
    durationIn: 2.2,
    durationOut: 2.7,
    delayMiddle: 1.5 // Ekranda kalma süresi (sn). Fontların yüklenmesini beklemek için default 1.5s
};

/**
 * Modern tailwind color equivalents for the transition
 */
const DEFAULT_COLORS = [
  
    '#3268e4', // blue-500
    '#4ad756',
    '#e43232',
    '#ed1556',
    
];

// Colors where the logo overlay should be dark for contrast
const LIGHT_HEXES = ['#3268e4', '#86efac', '#ec4899', '#22c55e']; 

const TransitionScribble = forwardRef<TransitionScribbleHandle, TransitionScribbleProps>(({
    logo,
    colors = DEFAULT_COLORS,
    config = DEFAULT_CONFIG,
    autoRun = true,
    onComplete
}, forwardedRef) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const logoContainerRef = useRef<HTMLDivElement>(null);
    const initialVeilRef = useRef<HTMLDivElement>(null);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [logoColor, setLogoColor] = useState('#fff');
    const [pathColor, setPathColor] = useState(colors[0]);

    const runAnimation = () => {
        const svg = svgRef.current;
        const path = pathRef.current;
        const logoWrapper = logoContainerRef.current;
        const container = containerRef.current;
        const veil = initialVeilRef.current;

        if (!svg || !path || isTransitioning || gsap.isTweening(path) || gsap.isTweening(svg)) return;

        setIsTransitioning(true);
        if (container) container.style.pointerEvents = 'auto'; // Block interface clicks during transition

        const durIn = config.durationIn || 0.8;
        const durOut = config.durationOut || 1.5;
        const delayMiddle = config.delayMiddle !== undefined ? config.delayMiddle : 1.5;

        gsap.set(svg, { scale: config.scale });

        const pathLength = path.getTotalLength();
        const l = pathLength + 5;

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setPathColor(randomColor);

        // Switch logo overlay to black or white based on background context
        const nextLogoColor = LIGHT_HEXES.includes(randomColor) ? '#000' : '#fff';
        setLogoColor(nextLogoColor);

        gsap.set(path, { strokeDasharray: l, strokeDashoffset: l, strokeWidth: config.strokeWidthStart, opacity: 1 });
        gsap.set(svg, { opacity: 1, x: 0, y: 0, rotation: 0 });
        if (logoWrapper) gsap.set(logoWrapper, { opacity: 0, scale: 1 });
        if (veil) gsap.set(veil, { autoAlpha: 1 }); // Başlangıçta sayfayı gizleyen katman aktif

        const drawTl = gsap.timeline({
            onComplete: () => {
                setIsTransitioning(false);
                if (container) container.style.pointerEvents = 'none';
                gsap.set(path, { strokeWidth: '0%' });
                if (logoWrapper) gsap.set(logoWrapper, { opacity: 0 });
                if (veil) gsap.set(veil, { autoAlpha: 0 }); // Her ihtimale karşı gizle
                if (onComplete) onComplete();
            }
        });

        drawTl.to(path, { strokeDashoffset: 0, duration: durIn, ease: 'power1.inOut' }, 0);
        drawTl.to(path, { strokeWidth: config.strokeWidthMax, duration: durIn, ease: 'power2.inOut' }, 0);
        
        // Arka planı (veil) ekrandaki çizgi tamamen içeri çekilmeye başladıktan "biraz daha sonra" kaldır (0.3s gecikme)
        if (veil) drawTl.set(veil, { autoAlpha: 0 }, durIn + delayMiddle + 0.7);

        drawTl.call(() => {
            const lenis = (window as any).__lenis;
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else window.scrollTo(0, 0);
        }, undefined, durIn);

        drawTl.to(path, { strokeDashoffset: -l, duration: durOut, ease: 'power2.inOut' }, durIn + delayMiddle);
        drawTl.to(path, { strokeWidth: config.strokeWidthStart, duration: durOut, ease: 'power2.inOut' }, durIn + delayMiddle);

        if (logoWrapper) {
            drawTl.set(logoWrapper, { autoAlpha: 0 }, 0);
            drawTl.to(logoWrapper, {
                autoAlpha: 1, duration: durIn * 0.5, ease: 'power2.out',
                onStart: () => {
                    const innerElem = logoWrapper.querySelector('svg, img, div');
                    if (innerElem) {
                        gsap.to(innerElem, { rotation: 5, duration: 0.15, repeat: -1, yoyo: true, ease: 'steps(1)', overwrite: 'auto' });
                    }
                }
            }, durIn * 0.5);

            drawTl.set(logoWrapper, {
                autoAlpha: 0,
                onComplete: () => {
                    const innerElem = logoWrapper.querySelector('svg, img, div');
                    if (innerElem) {
                        gsap.killTweensOf(innerElem);
                        gsap.set(innerElem, { rotation: 0 });
                    }
                }
            }, durIn + delayMiddle + (durOut * 0.48));
        }
    };

    useImperativeHandle(forwardedRef, () => ({
        runAnimation
    }));

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (autoRun) {
            timer = setTimeout(() => {
                runAnimation();
            }, 100);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRun]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Arka plandaki ham sayfayı başlangıçta gizlemek için düz zemin. Sayfa geçiş animasyonlarında kullanılır. */}
            <div ref={initialVeilRef} className="absolute inset-0 w-full h-full bg-background" />

            <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                width="100vw"
                height="100vh"
                viewBox="0 0 3222 3114"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 w-full h-full"
                style={{ color: pathColor }}
            >
                <path
                    ref={pathRef}
                    d="M299.654 453.865C505.574 319.225 711.494 184.585 836.054 109.945C960.614 35.3048 997.574 24.7448 944.014 110.385C890.454 196.025 745.254 378.185 571.454 634.385C397.654 890.585 199.654 1215.3 110.854 1382.58C22.0544 1549.86 48.4544 1549.86 77.8944 1540.62C107.334 1531.38 139.014 1512.9 367.854 1319.9C596.694 1126.9 1021.73 759.945 1255.21 555.065C1488.69 350.185 1517.73 318.505 1527.41 306.145C1537.09 293.785 1526.53 301.705 1346.85 618.625C1167.17 935.545 818.694 1561.22 635.214 1896.74C451.734 2232.26 443.814 2258.66 447.654 2268.3C451.494 2277.94 467.334 2270.02 511.134 2236.9C554.934 2203.78 626.214 2145.7 966.534 1817.46C1306.85 1489.22 1914.05 892.585 2263.81 557.505C2613.57 222.425 2687.49 166.985 2741.41 129.185C2795.33 91.3848 2827.01 72.9048 2843.33 67.3448C2859.65 61.7848 2859.65 69.7048 2849.09 96.2248C2838.53 122.745 2817.41 167.625 2584.77 544.505C2352.13 921.385 1370.37 2165.43 1139.25 2537.83C908.134 2910.23 902.854 2926.07 902.774 2939.51C902.694 2952.95 907.974 2963.51 1255.21 2613.87C1602.45 2264.23 2829.73 1017.54 2903.53 1071.46C2977.33 1125.38 2176.12 2817.04 2128 3037C2079.88 3256.96 2911.24 2018.56 3172 1793"
                    stroke="currentColor"
                    strokeLinecap="round"
                    style={{ strokeWidth: '0%', strokeDashoffset: '0.001', strokeDasharray: '0px, 999999px' }}
                />
            </svg>

            {logo && (
                <div
                    ref={logoContainerRef}
                    className="absolute flex justify-center items-center opacity-0 transition-colors duration-150 ease-out"
                    style={{ color: logoColor, zIndex: 10001 }}
                >
                    {logo}
                </div>
            )}
        </div>
    );
});

TransitionScribble.displayName = 'TransitionScribble';

export default TransitionScribble;
