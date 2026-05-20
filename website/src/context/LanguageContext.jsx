import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // 'en', 'hi', or 'ml'

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (en, hi, ml) => {
    if (language === 'hi') return hi || en;
    if (language === 'ml') return ml || en;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
