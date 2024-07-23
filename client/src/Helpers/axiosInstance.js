import axios from 'axios'
const BASE_URL = 'http://localhost:5000/api/v1';

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;

axiosInstance.defaults.withCredentials = true;

// This sets the withCredentials option to true for the Axios instance. This is useful when you need to send cookies or authentication tokens with cross-origin requests. It ensures that cookies are sent with every request made using this instance, which is important for maintaining sessions and handling authentication.

export default axiosInstance;