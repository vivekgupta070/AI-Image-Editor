import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await api.post('/users/token', params);
    return response.data;
};

export const register = async (email, password, fullName, profileImage) => {
    const response = await api.post('/users/', { email, password, full_name: fullName, profile_image: profileImage });
    return response.data;
};

export const getUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
};

export const getProjects = async () => {
    const response = await api.get('/projects/');
    return response.data;
};

export const createProject = async (title, description) => {
    const response = await api.post('/projects/', { title, description });
    return response.data;
};

export const getProject = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const processImage = async (imageUrl, prompt, operation, textTop = null, textBottom = null) => {
    const payload = {
        image_url: imageUrl,
        prompt: prompt || "none",
        operation: operation,
        text_top: textTop,
        text_bottom: textBottom
    };
    const response = await api.post('/ai/process', payload);
    return response.data;
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateUser = async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
};

export const updatePassword = async (currentPassword, newPassword) => {
    const response = await api.put('/users/me/password', { current_password: currentPassword, new_password: newPassword });
    return response.data;

    return response.data;

};

export const deleteUser = async () => {
    const response = await api.delete('/users/me');
    return response.data;
};

export default api;
