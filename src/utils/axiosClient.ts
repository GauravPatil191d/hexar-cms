import axios from "axios";

// Base Axios client
const axiosClient = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:8000",

    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to attach Authorization header if token exists
axiosClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("hexar_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default axiosClient;