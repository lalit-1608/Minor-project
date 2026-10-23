import React, { createContext, useContext, useEffect, useState } from 'react';
import { dataService } from '../services/dataService';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');

  useEffect(() => {
    // Load persisted theme
    dataService.getSettings().then(settings => {
      if (settings?.theme) {
        setThemeState(settings.theme);
      }
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (current) => {
      let isDark = false;
      if (current === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = current === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme(theme);

    const listener = () => {
      if (theme === 'system') applyTheme('system');
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const setTheme = async (newTheme) => {
    setThemeState(newTheme);
    await dataService.saveSettings({ theme: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
