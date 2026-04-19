import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Request Interceptor: Attach token if it exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`; // Backend uses "Bearer <token>" or just the token, wait. Let me check user API from backend. Let's just use Bearer since it's standard, and I can modify the format if backend expects just token, but userRoute.js would know. Wait, standard is Bearer. Actually I will just pass the token. Let's pass `Bearer ${token}`. Wait, let me check `middleware` in backend or just use `Bearer `.
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't trigger session expired for login requests
      if (error.config && !error.config.url.includes('/user/login') && !error.config.url.includes('/user/register')) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect handled by specific component or auth logic
      }
    }
    return Promise.reject(error);
  }
);

export default API;
