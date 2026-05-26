import "./style.css"
import { useState } from "react"
import { useTheme } from "./hooks/useTheme"
import { detectPrivacyPolicy } from "@privacy-scanner/privacy-policy-detector"
import { extractPageContent } from "./services/pageExtractor"
import { analyzePrivacyPolicy, waitForAnalysisResult } from "./services/api"

interface DetectionResult {
  isPrivacyPolicy: boolean
  confidence: number
  summary: string
}

export default function PrivacyRiskScannerPopup() {
  const [currentUrl, setCurrentUrl] = useState("")
  const [manualUrl, setManualUrl] = useState("")
  const [showInfo, setShowInfo] = useState(false)
  const [detection, setDetection] = useState<DetectionResult | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const { toggleTheme } = useTheme()

  const getCurrentTabUrl = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentUrl(tabs?.[0]?.url || "")
    })
  }

  const checkPrivacyPolicy = async () => {
    setIsDetecting(true)
    try {
      const { content, title, url } = await extractPageContent()
      const result = detectPrivacyPolicy(content, url, title)
      console.log("Detection Result:", result)
      if (result.isPrivacyPolicy) {
        setIsAnalyzing(true)
        const apiResponse = await analyzePrivacyPolicy({ content, title, url })
        if (!apiResponse.success || !apiResponse.task_id) {
          throw new Error("Failed to start analysis")
        }
        const finalResult = await waitForAnalysisResult( apiResponse.task_id )

        setAnalysisResult(finalResult)
        console.log("Analysis Result:", finalResult)
        setIsAnalyzing(false)
      }
      setDetection(result)
    } catch (error) {
      console.error("Error detecting privacy policy:", error)
      setDetection({
        isPrivacyPolicy: false,
        confidence: 0,
        findings: [],
        summary: "Failed to analyze page",
      })
    } finally {
      setIsDetecting(false)
    }
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

          <button
            onClick={checkPrivacyPolicy}
            disabled={isDetecting}
            className="mt-2 w-full py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDetecting ? "Checking..." : "Check if Privacy Policy"}
          </button>

          {detection && (
            <div className={`mt-3 p-2 rounded-lg text-xs space-y-2 ${
              detection.isPrivacyPolicy
                ? "bg-emerald-500/20 border border-emerald-500/50"
                : "bg-orange-500/20 border border-orange-500/50"
            }`}>
              <div className={detection.isPrivacyPolicy ? "text-emerald-700 dark:text-emerald-300" : "text-orange-700 dark:text-orange-300"}>
                <div className="font-semibold">
                  {detection.isPrivacyPolicy ? "✓ Privacy Policy Detected" : "✗ Not a Privacy Policy"}
                </div>
                <div className="mt-1">
                  Confidence: {detection.confidence}%
                </div>
              </div>

              {/* Debug Info */}
              {detection.findings && detection.findings.length > 0 && (
                <div className="mt-2 pt-2 border-t border-current/20 text-[10px] space-y-1">
                  <div className="font-semibold">Detection Details:</div>
                  {detection.findings.map((finding, idx) => (
                    <div key={idx} className="pl-2 border-l border-current/30">
                      <div className="font-semibold capitalize">{finding.type}: +{finding.score}pts</div>
                      <div className="opacity-90">{finding.reason}</div>
                      {finding.details && finding.details.length > 0 && (
                        <div className="opacity-75 mt-1">
                          Found: {finding.details.slice(0, 3).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {detection.findings && detection.findings.length === 0 && (
                <div className="mt-2 pt-2 border-t border-current/20 text-[10px]">
                  <div className="text-orange-600 dark:text-orange-400">No detection indicators found</div>
                  <div className="opacity-75 mt-1">Check if page content is being extracted correctly</div>
                </div>
              )}

              <div className="mt-2 text-[10px] opacity-75">
                {detection.summary}
              </div>
            </div>
          )}

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