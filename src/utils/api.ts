import axios from "axios"

export const axiosInstance = axios.create({
  // timeout: 30 * 1000, // todo
  headers: {
    "Cache-Control": "no-cache, no-store",
    Pragma: "no-cache",
  },
  withCredentials: true,
})
