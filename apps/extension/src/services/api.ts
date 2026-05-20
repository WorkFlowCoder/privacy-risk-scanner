export interface AnalyzeRequest {
  content: string
  title: string
  url: string
}

export interface AnalyzeResponse {
  success: boolean
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