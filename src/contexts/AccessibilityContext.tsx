import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontScale: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
};

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(0);

  const toggleHighContrast = useCallback(() => {
    setHighContrast(prev => !prev);
  }, []);

  const increaseFontSize = useCallback(() => {
    setFontScale(prev => Math.min(prev + 1, 2));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontScale(prev => Math.max(prev - 1, 0));
  }, []);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }

    html.classList.remove('font-large', 'font-xlarge');
    if (fontScale === 1) html.classList.add('font-large');
    if (fontScale === 2) html.classList.add('font-xlarge');
  }, [highContrast, fontScale]);

  return (
    <AccessibilityContext.Provider value={{ highContrast, toggleHighContrast, fontScale, increaseFontSize, decreaseFontSize, speak }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
