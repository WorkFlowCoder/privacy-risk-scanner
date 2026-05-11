import "./style.css"
import { useState } from "react"
import { useTheme } from "./hooks/useTheme"

export default function PrivacyRiskScannerPopup() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [manualUrl, setManualUrl] = useState("")
  const [showInfo, setShowInfo] = useState(false)

  const { toggleTheme } = useTheme()

  const getCurrentTabUrl = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentUrl(tabs?.[0]?.url || "")
    })
  }

  return (
    <div className="w-[380px] overflow-y-auto flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white transition">

      {/* HEADER */}
      <div className="border-b border-zinc-400 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
            PL
          </div>

          <div>
            <h1 className="text-sm font-bold">Privacy Lens</h1>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              AI privacy analysis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={toggleTheme}
            className="px-2 py-1 rounded-lg border border-zinc-400 dark:border-zinc-700 text-[11px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            🌙
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-8 h-8 rounded-full border border-zinc-400 dark:border-zinc-800 flex items-center justify-center text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 relative"
          >
            i

            {showInfo && (
              <div className="absolute right-0 top-12 w-64 p-3 text-[11px] rounded-xl border border-zinc-400 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl z-50">
                This extension analyzes privacy policies and detects data risks using AI.
              </div>
            )}
          </button>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-3">

        {/* ACCOUNT (more subtle) */}
        <div className="rounded-xl border border-zinc-400 dark:border-zinc-800 p-3 flex items-center justify-between">

          <div>
            <p className="text-xs font-medium">Account</p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Sync your reports
            </p>
          </div>

          <button className="px-3 py-1.5 text-xs rounded-lg bg-white text-black dark:bg-zinc-900 dark:text-white border border-zinc-400 dark:border-zinc-800 hover:opacity-90">
            Sign in
          </button>

        </div>

        {/* ANALYSIS TARGET */}
        <div className="rounded-xl p-3 border border-zinc-400 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">

          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] text-zinc-500 uppercase">
                URL to analyze
              </span>

              <p className="text-xs mt-1 break-all">
                {currentUrl || "Not captured yet"}
              </p>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Ready
            </span>
          </div>

          <button
            onClick={getCurrentTabUrl}
            className="mt-2 w-full py-2 rounded-lg bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition"
          >
            Use current page for analysis
          </button>

        </div>

        {/* MANUAL ANALYSIS */}
        <div className="rounded-xl p-3 border border-zinc-400 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">

          <h2 className="text-xs font-semibold">
            Analyze another site
          </h2>

          <input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://website.com/privacy"
            className="mt-2 w-full bg-white dark:bg-zinc-950 border border-zinc-400 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs outline-none focus:border-emerald-500"
          />

          <button className="mt-2 w-full py-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-black text-xs font-medium hover:opacity-90">
            Start analysis
          </button>

        </div>

        {/* FEATURES (unchanged but lighter) */}
        <div className="flex flex-wrap gap-2 text-[11px]">

          <div className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-800">
            📊 History
          </div>

          <div className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-800">
            ⚖️ Compare
          </div>

          <div className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-800">
            🚨 Alerts
          </div>

          <div className="px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-400 dark:border-zinc-800">
            🧠 AI summary
          </div>

        </div>

      </div>
    </div>
  )
}