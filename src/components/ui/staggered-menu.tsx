import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}
export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}
export interface StaggeredMenuDeveloper {
  name: string;
  link: string;
  avatarUrl?: string;
  status?: string;
}
export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  developers?: StaggeredMenuDeveloper[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#1b1e3e', '#4A55A2'], // default matching hero
  items = [],
  socialItems = [],
  developers = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/favicon.png', // assuming some logo or use the one passed
  menuButtonColor = '#fff',
  openMenuButtonColor = '#000',
  changeMenuColorOnOpen = true,
  accentColor = '#FFD100', // Our yellow
  isFixed = true,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['MENU', 'CLOSE']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

    });
    return () => ctx.revert();
  }, [position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
    const devItems = Array.from(panel.querySelectorAll('.sm-developer-item')) as HTMLElement[];
    const mobileCta = panel.querySelector('.sm-mobile-cta') as HTMLElement | null;

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
    if (devItems.length) gsap.set(devItems, { opacity: 0, y: 15 });
    if (mobileCta) gsap.set(mobileCta, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }

      if (devItems.length) {
        tl.to(devItems, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.1
        }, socialsStart + 0.2);
      }

      if (mobileCta) {
        tl.to(mobileCta, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out'
        }, socialsStart + 0.4);
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        const devItems = Array.from(panel.querySelectorAll('.sm-developer-item')) as HTMLElement[];
        if (devItems.length) gsap.set(devItems, { opacity: 0, y: 15 });
        const mobileCta = panel.querySelector('.sm-mobile-cta') as HTMLElement | null;
        if (mobileCta) gsap.set(mobileCta, { opacity: 0, y: 20 });

        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      // Only animate content color if we don't have a solid white bg natively
      // The CSS logic handles the wrapper
    },
    []
  );

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'MENU' : 'CLOSE';
    const targetLabel = opening ? 'CLOSE' : 'MENU';
    const cycles = 3;

    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'MENU' ? 'CLOSE' : 'MENU';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateText, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <>
      <div 
        className={`sm-scope staggered-menu-overlay ${isFixed ? 'fixed inset-0 pointer-events-none z-50 h-[100dvh]' : 'relative w-full h-full z-50'}`}
        style={{ '--sm-accent': accentColor, height: isFixed ? '100dvh' : '100%' } as React.CSSProperties}
        data-position={position}
        data-open={open || undefined}
      >
        {/* Pre-Layers (the animated backgrounds that slide in before the menu) */}
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        {/* OVERLAY PANEL */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full bg-white flex flex-col p-[6em_2em_2em_2em] md:p-[6em_4em_4em_4em] overflow-y-auto z-10 backdrop-blur-[12px] pointer-events-auto shadow-2xl"
          style={{ WebkitBackdropFilter: 'blur(12px)', height: '100%' }}
          aria-hidden={!open}
        >
          <div className="sm-panel-inner flex-1 flex flex-col gap-6 md:gap-10">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2 md:gap-4"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                    <Link
                      className="sm-panel-item relative text-black font-averta-std font-black text-4xl md:text-6xl cursor-pointer leading-none tracking-tight uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1em]"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={closeMenu}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </Link>
                  </li>
                ))
              ) : null}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="sm-socials mt-6 flex flex-col gap-4" aria-label="Social links">
                <h3 className="sm-socials-title m-0 text-sm md:text-base font-semibold tracking-widest uppercase [color:var(--sm-accent,#ff0000)]">Sosyal Medya</h3>
                <ul
                  className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-6 md:gap-8 flex-wrap"
                  role="list"
                >
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link text-lg md:text-xl font-medium text-[#111] no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear hover:text-[var(--sm-accent)]"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {developers && developers.length > 0 && (
              <div className="sm-developer-section mt-auto pt-8 flex flex-col gap-6 border-t border-black/5">
                {developers.map((dev, idx) => (
                  <div key={idx} className="sm-developer-item flex items-center gap-4 group">
                    <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 transition-transform duration-500 group-hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-[var(--sm-accent)] shadow-lg">
                        <img 
                          src={dev.avatarUrl || `https://github.com/${dev.link.split('/').pop()}.png`} 
                          alt={dev.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-[#22c55e] rounded-full border-2 border-white shadow-[0_0_10px_rgba(34,197,94,0.6)] sm-status-dot z-10" />
                    </div>
                    <div className="flex flex-col">
                      <span className="sm-developer-label text-[10px] md:text-xs font-averta-std uppercase tracking-widest opacity-40">Developer</span>
                      <a 
                        href={dev.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="sm-developer-link text-base md:text-lg font-averta-std font-black text-black no-underline hover:text-[var(--sm-accent)] transition-colors duration-300 uppercase leading-none"
                      >
                        {dev.name}
                      </a>
                      {dev.status && (
                        <span className="text-[9px] md:text-[10px] text-[#22c55e] font-bold uppercase tracking-wider mt-1">{dev.status}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="sm-mobile-cta md:hidden mt-4 pt-4 border-t border-black/5">
              <Link 
                href="/basvuru" 
                className="block text-center bg-[#FFD100] text-black py-4 rounded-full font-averta-std font-bold uppercase text-sm tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-md"
                onClick={closeMenu}
              >
                ARAMIZA KATIL
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* HEADER FOR BLENDED ELEMENTS (Logo & Toggle) */}
      <header
        className="sm-scope staggered-menu-header-blended fixed top-4 md:top-10 left-0 w-full h-[60px] md:h-[100px] bg-transparent pointer-events-none z-[60] transition-all duration-300"
        style={{ mixBlendMode: !open ? "difference" : "normal" }}
        aria-label="Blended navigation header"
      >
        {/* MOBILE LOGO (Left) | DESKTOP LOGO (Center) */}
        <div 
            className="sm-logo absolute left-4 md:left-1/2 md:-translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center select-none pointer-events-auto transition-all duration-300" 
            aria-label="Logo"
        >
          <Link href="/" onClick={closeMenu}>
            <img
              src={logoUrl || '/favicon.png'}
              alt="Logo"
              className={`sm-logo-img block h-8 md:h-16 w-auto object-contain transition-all duration-300 ${!open ? 'brightness-0 invert' : ''}`}
              draggable={false}
            />
          </Link>
        </div>

        {/* DESKTOP MENU BUTTON (Left) | MOBILE MENU BUTTON (Right) */}
        <button
          ref={toggleBtnRef}
          className={`sm-toggle absolute right-4 md:right-auto md:left-10 top-1/2 -translate-y-1/2 inline-flex items-center gap-[0.5rem] cursor-pointer font-averta-std font-semibold text-xs md:text-sm tracking-widest leading-none overflow-visible pointer-events-auto transition-all duration-300
            ${open 
              ? 'text-black md:bg-[#1b1e3e] md:text-white md:px-6 md:py-3.5 md:rounded-full md:shadow-md' 
              : 'text-white md:bg-white md:text-black md:px-6 md:py-3.5 md:rounded-full'
            }
          `}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          type="button"
        >
          <span
            ref={iconRef}
            className="sm-icon relative w-[16px] h-[16px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
            aria-hidden="true"
          >
            <span
              ref={plusHRef}
              className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
            />
            <span
              ref={plusVRef}
              className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform] -mt-[6px]"
            />
          </span>
          
          <span
            ref={textWrapRef}
            className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)] mt-[2px]"
            aria-hidden="true"
          >
            <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
              {textLines.map((l, i) => (
                <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                  {l}
                </span>
              ))}
            </span>
          </span>
        </button>
      </header>

      {/* NORMAL HEADER FOR NON-BLENDED ELEMENTS (Aramıza Katıl) */}
      <div className="sm-scope staggered-menu-header-normal fixed top-4 md:top-10 left-0 w-full h-[60px] md:h-[100px] pointer-events-none z-[60] transition-all duration-300">
        {/* DESKTOP LET'S TALK / ARAMIZA KATIL BUTTON (Right) */}
        <div className={`absolute right-10 top-1/2 -translate-y-1/2 hidden md:flex pointer-events-auto transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}>
            <Link 
              href="/basvuru" 
              className="bg-[#FFD100] text-black px-6 py-3.5 rounded-full font-averta-std font-bold uppercase text-xs md:text-sm tracking-widest hover:bg-white transition-colors duration-300"
              onClick={closeMenu}
            >
              ARAMIZA KATIL
            </Link>
        </div>
      </div>

      <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-toggle { border: none; }
.sm-scope .sm-toggle:focus-visible { outline: none; }
.sm-scope .sm-toggle-textWrap { min-width: 50px; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; transition: all 0.3s; }
.sm-scope .sm-icon-line.sm-icon-line-v { margin-top: 0; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(300px, 45vw, 550px); height: 100%; background: white; z-index: 10; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(300px, 45vw, 550px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-developer-section { margin-top: auto; padding-top: 1.5rem; }
.sm-scope .sm-developer-link { position: relative; display: inline-block; }
.sm-scope .sm-status-dot { animation: sm-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes sm-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: .7; transform: scale(1.1); }
}
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 0; font-size: 1.25rem; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; } .sm-scope .sm-prelayers { width: 100%; } }
      `}</style>
    </>
  );
};

export default StaggeredMenu;
