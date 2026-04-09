'use client';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';

import Footer from '../marginals/footer';
import Navbar from '../marginals/navbar';
import Preloader from '../preloader/preloader';

function HOC({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTeamPage = pathname === '/ekip';

  return (
    <>
      <Preloader />
      <Navbar />
      <ReactLenis
        root
        options={{
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          touchMultiplier: 1.5,
        }}
      >
        {children}
      </ReactLenis>
      <Footer />
    </>
  );
}

export default HOC;
