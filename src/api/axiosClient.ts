import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios"
import { STATIC_HOST } from "../common"

const axiosClient = axios.create({
    baseURL: `${STATIC_HOST}`,
    headers: {
        "Content-Type": "application/json",
    },
})

// Add a request interceptor
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("access_token")
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }

        // Ensure the body is JSON stringified if the method is POST or PUT
        if (config.data && (config.method === 'post' || config.method === 'put')) {
            config.data = JSON.stringify(config.data)
        }

        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
    function (response: { data: any }) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response?.data
    },
    function (error: AxiosError) {
        return Promise.reject(error)
    }
)

export default axiosClient
