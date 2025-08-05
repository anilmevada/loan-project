"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function useTheme() {
    const context = useNextTheme();
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    const { theme, setTheme: setNextTheme } = context;

    React.useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.documentElement.className = storedTheme;
        } else if (theme) {
            document.documentElement.className = theme;
        }
    }, [theme]);

    const setTheme = (newTheme: string) => {
        localStorage.setItem('theme', newTheme);
        document.documentElement.className = newTheme;
        setNextTheme(newTheme);
    };

    return { ...context, setTheme };
}
