export type UserRole = 'user' | 'admin';

export interface User {
  id: string; // Legacy ID field
  _id: string; // Mongo ID field
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  onboardingCompleted: boolean;
  interests: Category[] | string[];
  createdAt: string;
}


export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Prompt {
  _id: string;
  title: string;
  description: string;
  promptText: string;
  imageUrl: string;
  model: string;
  category: Category;
  author: User;
  status: 'pending' | 'approved';
  likes: number;
  saves: number;
  commentsCount: number;
  views: number;
  score: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  _id: string;
  promptId: string;
  author: {
    _id: string;
    name: string;
  };
  text: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: 'liked' | 'commented' | 'prompt_approved' | 'new_submission';
  promptId: {
    _id: string;
    title: string;
  };
  actorName: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  prompts: T[];
  total: number;
  page: number;
  pages: number;
}
