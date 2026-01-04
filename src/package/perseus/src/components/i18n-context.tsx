/**
 * Perseus i18n Context
 * Internationalization context for Perseus components
 */

import React, { createContext, useContext, ReactNode } from 'react';

interface I18nContextType {
  locale: string;
  translate: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  translate: (key: string) => key,
});

export const useI18n = () => useContext(I18nContext);

export const PerseusI18nContextProvider: React.FC<{ children: ReactNode; locale?: string }> = ({
  children,
  locale = 'en'
}) => {
  const value: I18nContextType = {
    locale,
    translate: (key: string) => key,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export default I18nContext;
