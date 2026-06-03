import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getAnalysisById } from "../services/api"

const extractDomain = (url: string): string => {
  return new URL(url).hostname
}

const getTimeAgo = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)

  const diffMs = now.getTime() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds} seconds ago`
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`

  return `${days} days ago`
}

const severityClasses: Record<string, string> = {
  critical: "bg-red-700/30 text-red-200 border-red-600/60",
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  low: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
}

const severityLabels: Record<string, string> = {
  critical: "Critical risk",
  high: "High risk",
  medium: "Medium risk",
  low: "Low risk"
}

const scoreClasses: Record<string, string> = {
  red: "bg-red-500/20 text-red-400 border-red-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  green: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
}

export default function AnalysisDetailPage() {
  const { id } = useParams()

  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAnalysisById(id!)
        console.log(data)
        setAnalysis(data)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400 text-lg">
          Loading analysis...
        </p>
      </main>
    )
  }

  if (!analysis) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">
          Analysis not found
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col gap-8">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-zinc-500 hover:text-white transition text-sm w-fit"
            >
              ← Back to dashboard
            </Link>

            <h1 className="text-4xl font-bold">
              {extractDomain(analysis.url)}
            </h1>

            <p className="text-zinc-400">
              Last analyzed {getTimeAgo(analysis.updated_at)}
            </p>
          </div>

          <div
            className={`${scoreClasses[analysis.rating]} border px-6 py-3 rounded-2xl`}
          >
            <p className="text-sm opacity-70">
              Privacy score
            </p>

            <h2 className="text-3xl font-bold">
              {analysis.global_score ?? "N/A"}
            </h2>
          </div>

        </div>

        {/* URL CARD */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-3">

          <div>
            <p className="text-zinc-500 text-sm">
              Analyzed URL
            </p>

            <h2 className="text-lg font-medium break-all">
              {analysis.url}
            </h2>
          </div>

          <div className="flex gap-3 flex-wrap">

            {analysis.clauses?.map((clause: any) => (
              <div key={clause.title} className="flex gap-2 flex-wrap">
                <div className={`${severityClasses[clause.severity]} border px-3 py-1 rounded-full text-sm`}>
                  {clause.category.replace("_", " ")}
                </div>
              </div>
            ))}

          </div>

        </div>

        {/* SUMMARY */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              AI Summary
            </h2>

            <p className="text-zinc-500 mt-1">
              Automatically generated privacy risk overview
            </p>
          </div>

          <p className="text-zinc-300 leading-8 text-lg">
            {analysis.summary}
          </p>

        </div>

        {/* CLAUSES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          <div className="mb-8">
            <h2 className="text-2xl font-semibold">
              Detected Risk Clauses
            </h2>

            <p className="text-zinc-500 mt-1">
              Clauses extracted from the privacy policy analysis
            </p>
          </div>

          <div className="flex flex-col gap-6">

            {analysis.clauses?.map((clause: any) => (
              <div
                key={clause.id}
                className="border border-zinc-800 rounded-2xl p-6 bg-zinc-950"
              >

                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 flex-wrap">

                  <div>
                    <h3 className="text-xl font-semibold capitalize">
                      {clause.title}
                    </h3>
                  </div>

                  <div
                    className={`${severityClasses[clause.severity]} border px-4 py-2 rounded-full text-sm font-medium`}
                  >
                    {severityLabels[clause.severity]}
                  </div>

                </div>

                {/* CONTENT */}
                <div className="mt-6 flex flex-col gap-6">

                  <div>
                    <p className="text-zinc-500 text-sm mb-2">
                      Explanation
                    </p>

                    <p className="text-zinc-300 leading-7">
                      {clause.explanation}
                    </p>
                  </div>

                  <div>
                    <p className="text-zinc-500 text-sm mb-2">
                      Extracted policy text
                    </p>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-400 italic leading-7">
                        "{clause.extracted_text}"
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">

                    <div className="ml-auto bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full text-sm text-zinc-300">
                      Impact: {clause.score_impact}
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>
    </main>
  )
}