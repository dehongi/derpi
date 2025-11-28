import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export const contactUs = async (data: { name: string; email: string; subject: string; message: string }) => {
    return api.post('/website/messages/', data);
};

export default api;
