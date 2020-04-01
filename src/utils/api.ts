import axios from "axios"

export const axiosInstance = axios.create({
  headers: {
    "Cache-Control": "no-cache, no-store",
    Pragma: "no-cache",
  },
  withCredentials: true,
})
