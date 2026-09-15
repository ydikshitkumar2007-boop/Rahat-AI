'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations } from '../i18n/messages';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('rahat-language') as Language) || 'en';
    setLanguageState(savedLang);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('rahat-language', language);
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
  };

  const t = (key: keyof typeof translations.en): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
