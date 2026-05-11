import { useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"

interface UseThemeOptions {
  defaultTheme?: Theme
  storageKey?: string
}

export function useTheme(options: UseThemeOptions = {}) {
  const {
    defaultTheme = "dark",
    storageKey = "privacy-risk-theme",
  } = options

  const getSystemTheme = (): "dark" | "light" => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  const getInitialTheme = (): Theme => {
    const saved = localStorage.getItem(storageKey) as Theme | null
    return saved || defaultTheme
  }

  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // applique le thème réel (résout system → dark/light)
  const resolvedTheme: "dark" | "light" =
    theme === "system" ? getSystemTheme() : theme

  // applique la classe dark sur <html>
  useEffect(() => {
    const root = document.documentElement

    if (resolvedTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    localStorage.setItem(storageKey, theme)
  }, [theme, resolvedTheme, storageKey])

  // toggle simple (dark/light uniquement)
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  // options avancées
  const setDark = () => setTheme("dark")
  const setLight = () => setTheme("light")
  const setSystem = () => setTheme("system")

  return {
    theme,              // valeur choisie (dark/light/system)
    resolvedTheme,     // valeur réelle appliquée
    setTheme,
    toggleTheme,
    setDark,
    setLight,
    setSystem,
  }
}