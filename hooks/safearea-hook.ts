import { useEffect } from 'react';

export const useViewportHeight = () => {
  useEffect(() => {
    const adjustHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    adjustHeight(); // Initial adjustment
    window.addEventListener('resize', adjustHeight);

    // Cleanup on component unmount
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);
};