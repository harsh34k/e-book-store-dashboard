import axios from 'axios';
import useTokenStore from '@/store';
import { ProfileFormValues } from '@/pages/EditDetails';

const api = axios.create({
    // todo: move this value to env variable.
    baseURL: import.meta.env.VITE_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useTokenStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const login = async (data: { email: string; password: string }) =>
    api.post('/api/users/login', data);

export const register = async (data: { name: string; email: string; password: string }) =>
    api.post('/api/users/register', data);

export const updateDetails = async ({ email, oldPassword, newPassword }: ProfileFormValues) => {
    console.log("updateDetils", { email, oldPassword, newPassword });

    api.patch('/api/users/updateDetails', { email, oldPassword, newPassword });
}

export const getBooks = async () => api.get('/api/books');

export const getFilteredBooks = async (searchQuery: string | null) => api.get(`/api/books/search?title=${searchQuery}`);

export const createBook = async (data: FormData) =>
    api.post('/api/books', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
export const updateBook = async ({ bookId, formdata }: { bookId: string; formdata: FormData }) =>
    api.patch(`/api/books/${bookId}`, formdata, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
export const deleteBook = async (bookId: string) =>
    api.delete(`/api/books/${bookId}`);
