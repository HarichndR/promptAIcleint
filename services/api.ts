import type { ApiResponse, PaginatedResponse, Prompt, Category, Comment, User } from '../types';
import type { Notification as AppNotification } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prmptaibackend.onrender.com/api';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Auth
export const authApi = {
  login: (credentials: any) => fetcher<{ user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data: any) => fetcher<{ user: User }>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetcher<void>('/auth/logout', { method: 'POST' }),
  getMe: () => fetcher<{ user: User }>('/auth/me'),
  completeOnboarding: (interests: string[]) => fetcher<{ user: User }>('/auth/onboarding', { method: 'PUT', body: JSON.stringify({ interests }) }),
  updateProfile: (data: FormData) => fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'PUT',
    body: data,
    credentials: 'include',
  }).then(res => res.json() as Promise<ApiResponse<{ user: User }>>),
};

// Prompts
export const promptApi = {
  getPrompts: (params?: string) => fetcher<PaginatedResponse<Prompt>>(`/prompts${params ? `?${params}` : ''}`),
  getPromptById: (id: string) => fetcher<Prompt & { isLiked: boolean; isSaved: boolean }>(`/prompts/${id}`),
  createPrompt: (formData: FormData) => fetch(`${API_BASE_URL}/prompts`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  }).then(res => res.json() as Promise<ApiResponse<Prompt>>),
  updatePrompt: (id: string, formData: FormData) => fetch(`${API_BASE_URL}/prompts/${id}`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
  }).then(res => res.json() as Promise<ApiResponse<Prompt>>),
  deletePrompt: (id: string) => fetcher<void>(`/prompts/${id}`, { method: 'DELETE' }),
  toggleLike: (id: string) => fetcher<{ likes: number }>(`/prompts/${id}/like`, { method: 'POST' }),
  toggleSave: (id: string) => fetcher<void>(`/prompts/${id}/save`, { method: 'POST' }),
  getSavedPrompts: () => fetcher<Prompt[]>('/prompts/saved'),
  getMyPrompts: (sort?: string) => fetcher<Prompt[]>(`/prompts/my${sort ? `?sort=${sort}` : ''}`),
};


// Categories
export const categoryApi = {
  getCategories: () => fetcher<Category[]>('/categories'),
  createCategory: (data: { name: string; description?: string }) => fetcher<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: { name: string; description?: string }) => fetcher<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetcher<void>(`/categories/${id}`, { method: 'DELETE' }),
};

// Comments
export const commentApi = {
  getComments: (promptId: string, page = 1) => fetcher<{ comments: Comment[]; total: number; page: number; pages: number }>(`/comments/${promptId}?page=${page}`),
  postComment: (promptId: string, text: string) => fetcher<Comment>(`/comments/${promptId}`, { method: 'POST', body: JSON.stringify({ text }) }),
};

// Notifications
export const notificationApi = {
  getNotifications: () => fetcher<{ notifications: AppNotification[]; unreadCount: number }>('/notifications'),
  markAsRead: () => fetcher<void>('/notifications/read', { method: 'PUT' }),
};

// Admin
export const adminApi = {
  getAdminStats: () => fetcher<{
    totalPrompts: number;
    pendingPrompts: number;
    totalUsers: number;
    approvedPrompts: number;
  }>('/admin/stats'),
  getAllPrompts: (status?: string, search?: string, sort?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    const queryString = params.toString();
    return fetcher<Prompt[]>(`/admin/prompts${queryString ? `?${queryString}` : ''}`);
  },

  approvePrompt: (id: string) => fetcher<Prompt>(`/admin/prompts/${id}/approve`, { method: 'PUT' }),
  rejectPrompt: (id: string) => fetcher<void>(`/admin/prompts/${id}/reject`, { method: 'PUT' }),
  deletePrompt: (id: string) => fetcher<void>(`/admin/prompts/${id}`, { method: 'DELETE' }),
};

