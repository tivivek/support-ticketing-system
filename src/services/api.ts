import axios from 'axios';
import type { PaginatedResponse, Ticket, Message, User } from '../types/index';
import { authAPI, ticketsAPI, messagesAPI } from '../mocks/mockApi';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            refreshToken,
          }
        );

        const { token } = response.data;
        localStorage.setItem('token', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// export const authAPI = {
//   login: async (email: string, password: string) => {
//     const response = await api.post('/auth/login', { email, password });
//     return response.data;
//   },
//   logout: async () => {
//     const response = await api.post('/auth/logout');
//     return response.data;
//   },
//   getCurrentUser: async () => {
//     const response = await api.get('/auth/me');
//     return response.data as User;
//   },
// };

// export const ticketsAPI = {
//   getTickets: async (params: {
//     page?: number;
//     pageSize?: number;
//     status?: string;
//     priority?: string;
//     assignedTo?: string;
//     tags?: string[];
//     search?: string;
//     sortBy?: string;
//     sortOrder?: 'asc' | 'desc';
//   }) => {
//     const response = await api.get('/tickets', { params });
//     return response.data as PaginatedResponse<Ticket>;
//   },
//   getTicketById: async (id: string) => {
//     const response = await api.get(`/tickets/${id}`);
//     return response.data as Ticket;
//   },
//   createTicket: async (ticket: Partial<Ticket>) => {
//     const response = await api.post('/tickets', ticket);
//     return response.data as Ticket;
//   },
//   updateTicket: async (id: string, ticket: Partial<Ticket>) => {
//     const response = await api.put(`/tickets/${id}`, ticket);
//     return response.data as Ticket;
//   },
//   deleteTicket: async (id: string) => {
//     const response = await api.delete(`/tickets/${id}`);
//     return response.data;
//   },
// };

// export const messagesAPI = {
//   getMessages: async (ticketId: string) => {
//     const response = await api.get(`/tickets/${ticketId}/messages`);
//     return response.data as Message[];
//   },
//   createMessage: async (
//     ticketId: string,
//     content: string,
//     attachments?: File[]
//   ) => {
//     const formData = new FormData();
//     formData.append('content', content);

//     if (attachments && attachments.length > 0) {
//       attachments.forEach((file) => {
//         formData.append('attachments', file);
//       });
//     }

//     const response = await api.post(`/tickets/${ticketId}/messages`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return response.data as Message;
//   },
// };

export const usersAPI = {
  getUsers: async () => {
    const response = await api.get('/users');
    return response.data as User[];
  },
  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data as User;
  },
};

export default api;
