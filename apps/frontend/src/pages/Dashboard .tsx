import { useEffect, useState } from "react"
import { getEnable, getResults } from "../services/api"
import { useNavigate } from "react-router-dom"

const extractDomain = (url: string): string => {
  return new URL(url).hostname
}

export const getTimeAgo = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)

  const diffMs = now.getTime() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return `${seconds} seconds ago`
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`
  }
  if (hours < 24) {
    return `${hours} hours ago`
  }
  return `${days} days ago`
}

function Dashboard() {
  const navigate = useNavigate()
  const [message, setMessage] = useState("Loading backend...")
  const [results, setResults] = useState<any>(null)

  const severityClasses: Record<string, string> = {
    high: "bg-red-500/20 text-red-400 border-red-500/30",
    medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  }

  useEffect(() => {
    const fetchBackendStatus = async () => {
      try {
        const data = await getEnable()
        setMessage(data)
        const resultsData = await getResults()
        setResults(resultsData)
      } catch {
        setMessage("Backend unavailable")
      }
    }
    fetchBackendStatus()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col gap-8">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Privacy Risk Scanner
            </h1>

            <p className="text-zinc-400 mt-2">
              AI-powered privacy policy analysis dashboard
            </p>
          </div>

          <button className="bg-emerald-500 hover:bg-emerald-400 transition text-black font-semibold px-5 py-3 rounded-xl">
            New Analysis
          </button>

        </div>

        {/* BACKEND STATUS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">

          <p className="text-zinc-400 text-sm">
            Backend status
          </p>

          <h2 className="text-2xl font-semibold mt-2">
            {message}
          </h2>

        </div>

        {/* ANALYSIS CARD */}
        {results && results.map((result: any) => (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 onClick={() => navigate(`/analysis/${result.id}`)} className="text-xl font-semibold">
                  {result?.url ? extractDomain(result.url) : "N/A"}
                </h2>

                <p className="text-zinc-400 text-sm mt-1">
                  Last analyzed {result?.updated_at ? getTimeAgo(result.updated_at) : "N/A"}
                </p>
              </div>

              <div className={`bg-${result.rating}-500/20 border border-${result.rating}-500/30 text-${result.rating}-400 px-4 py-2 rounded-full font-semibold`}>
                Score: {result?.global_score ?? "N/A"}
              </div>

            </div>

            <p className="text-zinc-300 leading-relaxed">
              {result?.summary ?? "No summary available."}
            </p>

            {result.clauses?.map((clause: any) => (
              <div key={clause.title} className="flex gap-2 flex-wrap">
                <div className={`${severityClasses[clause.severity]} border px-3 py-1 rounded-full text-sm`}>
                  {clause.category}
                </div>
              </div>
            ))}

          </div>
        ))}

      </div>

    </main>
  )
}

export default Dashboard