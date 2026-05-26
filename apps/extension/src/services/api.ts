export interface AnalyzeRequest {
  content: string
  title: string
  url: string
}

export interface AnalyzeResponse {
  success: boolean
  task_id?: string
  status?: string
  result?: any
  error?: string
}

let url = "http://localhost:8000"


export const analyzePrivacyPolicy = async (
  payload: AnalyzeRequest
): Promise<AnalyzeResponse> => {
  try {
    const response = await fetch(`${url}/analyze/`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Error:", error)

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const waitForAnalysisResult = async (
  taskId: string
): Promise<any> => {
  const maxRetries = 30

  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(
      `${url}/tasks/${taskId}`
    )

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (data.status === "done") {
      return data.result
    }

    if (data.status === "failed") {
      throw new Error(data.error || "Analysis failed")
    }

    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    )
  }

  throw new Error("Analysis timeout")
}