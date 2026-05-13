import { useEffect, useState } from "react"

import api from "./services/api"

function App() {
  const [message, setMessage] = useState("Loading backend...")

  useEffect(() => {
    api.get("/").then((res) => {
        setMessage(res.data.message)
      })
      .catch(() => {
        setMessage("Backend unavailable")
      })
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                google.com
              </h2>

              <p className="text-zinc-400 text-sm mt-1">
                Last analyzed 2 hours ago
              </p>
            </div>

            <div className="bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full font-semibold">
              Score: 72
            </div>

          </div>

          <p className="text-zinc-300 leading-relaxed">
            This website shares user data with third-party partners and keeps some information for extended periods.
          </p>

          <div className="flex gap-2 flex-wrap">

            <div className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-sm">
              Third-party sharing
            </div>

            <div className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-sm">
              Long retention
            </div>

            <div className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-sm">
              Limited recourse
            </div>

          </div>

        </div>

      </div>

    </main>
  )
}

export default App