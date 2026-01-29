// API Service for Backend Integration
// Use process.env for compatibility with both Vite and Jest
// In Vite, this will be replaced at build time
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

// Auth Token Management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('auth_token', token);
    } else {
        localStorage.removeItem('auth_token');
    }
};

export const getAuthToken = () => authToken;

// Generic API Request Handler
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
            return { error: errorData.detail || `HTTP ${response.status}` };
        }

        // Handle 204 No Content (e.g., DELETE requests)
        if (response.status === 204) {
            return { data: {} as T };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: error instanceof Error ? error.message : 'Network error' };
    }
}

// Authentication APIs
export const authAPI = {
    register: async (email: string, name: string, password: string, initialDeposit: number = 10000, role: string = 'CLIENT') => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, name, password, initial_deposit: initialDeposit, role }),
        });
    },

    login: async (email: string, password: string) => {
        const response = await apiRequest<{ access_token: string; token_type: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.data?.access_token) {
            setAuthToken(response.data.access_token);
        }

        return response;
    },

    getCurrentUser: async () => {
        return apiRequest('/auth/me', { method: 'GET' });
    },

    getAllUsers: async () => {
        return apiRequest('/auth/users', { method: 'GET' });
    },

    getUserById: async (userId: string) => {
        return apiRequest(`/auth/users/${userId}`, { method: 'GET' });
    },

    updateUser: async (userId: string, data: any) => {
        return apiRequest(`/auth/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteUser: async (userId: string) => {
        return apiRequest(`/auth/users/${userId}`, { method: 'DELETE' });
    },

    logout: () => {
        setAuthToken(null);
    },
};

// Trade APIs
export const tradeAPI = {
    getAllTrades: async (status?: string) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/trades/${query}`, { method: 'GET' });
    },

    getTradeById: async (tradeId: string) => {
        return apiRequest(`/trades/${tradeId}`, { method: 'GET' });
    },

    createTrade: async (tradeData: any) => {
        return apiRequest('/trades/', {
            method: 'POST',
            body: JSON.stringify(tradeData),
        });
    },

    updateTrade: async (tradeId: string, tradeData: any) => {
        return apiRequest(`/trades/${tradeId}`, {
            method: 'PUT',
            body: JSON.stringify(tradeData),
        });
    },

    closeTrade: async (tradeId: string, exitPrice: number) => {
        return apiRequest(`/trades/${tradeId}/close?exit_price=${exitPrice}`, {
            method: 'POST',
        });
    },

    deleteTrade: async (tradeId: string) => {
        return apiRequest(`/trades/${tradeId}`, { method: 'DELETE' });
    },
};

// Portfolio APIs
export const portfolioAPI = {
    getPortfolioSummary: async (userId: string) => {
        return apiRequest(`/portfolio/${userId}/summary`, { method: 'GET' });
    },
};

// Announcement APIs
export const announcementAPI = {
    getAllAnnouncements: async () => {
        return apiRequest('/announcements/', { method: 'GET' });
    },

    getAnnouncementById: async (announcementId: string) => {
        return apiRequest(`/announcements/${announcementId}`, { method: 'GET' });
    },

    createAnnouncement: async (title: string, content: string) => {
        return apiRequest('/announcements/', {
            method: 'POST',
            body: JSON.stringify({ title, content }),
        });
    },

    deleteAnnouncement: async (announcementId: string) => {
        return apiRequest(`/announcements/${announcementId}`, { method: 'DELETE' });
    },

    getReplies: async (announcementId: string) => {
        return apiRequest(`/announcements/${announcementId}/replies`, { method: 'GET' });
    },

    createReply: async (announcementId: string, content: string) => {
        return apiRequest(`/announcements/${announcementId}/replies`, {
            method: 'POST',
            body: JSON.stringify({ announcement_id: announcementId, content }),
        });
    },

    deleteReply: async (replyId: string) => {
        return apiRequest(`/announcements/replies/${replyId}`, { method: 'DELETE' });
    },
};

// Health Check
export const healthCheck = async () => {
    return apiRequest('/health', { method: 'GET' });
};

export default {
    auth: authAPI,
    trade: tradeAPI,
    portfolio: portfolioAPI,
    announcement: announcementAPI,
    healthCheck,
};
