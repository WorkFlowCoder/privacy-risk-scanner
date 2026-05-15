import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json"
  }
})

// HEALTH CHECK
export const getEnable = async (): Promise<string> => {
  const response = await api.get("/")

  return response.data.message
}

// ANALYZE
export const analyzeWebsite = async (url: string) => {
  const response = await api.post("/analyze", {
    url
  })

  return response.data
}

// RESULTS
export const getResults = async () => {
  const response = await api.get("/analyze/results")

  return response.data
}

// RESULT BY ID
export const getAnalysisById = async (id: string) => {
  const res = await api.get(`/analyze/${id}`)
  return res.data
}


export default api