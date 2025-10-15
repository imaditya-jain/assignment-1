import axios from 'axios';

// Create axios instance with default configuration
const axiosInstance = axios.create({
    withCredentials: true,
    timeout: 10000,
});

export default axiosInstance;