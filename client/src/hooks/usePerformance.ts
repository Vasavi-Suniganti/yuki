import { useState, useEffect } from 'react';

export function usePerformance() {
  const [isMobile, setIsMobile] = useState(false);
  const [dpr, setDpr] = useState(1.5);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const targetDpr = mobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      setDpr(targetDpr);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return { isMobile, dpr };
}
