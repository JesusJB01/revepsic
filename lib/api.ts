// API Client for REVEPSIC Blog
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: object;
  headers?: Record<string, string>;
  auth?: boolean;
}

// Get tokens from localStorage
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

function clearTokens(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// Refresh access token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return null;
    }

    const data = await response.json();
    if (data.success && data.data?.accessToken) {
      setTokens(data.data.accessToken, data.data.refreshToken || refreshToken);
      return data.data.accessToken;
    }
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

// Main API fetch function
async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, auth = false } = options;

  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      fetchHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: fetchHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // Handle rate limiting (429)
    if (response.status === 429) {
      return { 
        success: false, 
        message: 'Demasiados intentos. Por favor espera unos minutos antes de intentar de nuevo.' 
      };
    }

    // If 401 and we have auth, try to refresh token
    if (response.status === 401 && auth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        fetchHeaders['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method,
          headers: fetchHeaders,
          body: body ? JSON.stringify(body) : undefined,
        });
      } else {
        // Don't redirect here - let components handle auth state
        clearTokens();
        return { success: false, message: 'Sesión expirada. Por favor inicia sesión de nuevo.' };
      }
    }

    // Handle other error status codes
    if (!response.ok && response.status !== 401) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        message: errorData.message || errorData.error || `Error del servidor (${response.status})` 
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Error de conexión. Verifica tu conexión a internet.' };
  }
}

// ============ AUTH API ============
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiFetch<{ 
      user: object; 
      tokens: { accessToken: string; refreshToken: string } 
    }>(
      '/auth/login',
      { method: 'POST', body: { email, password } }
    );
    
    if (response.success && response.data) {
      const tokens = response.data.tokens;
      if (tokens?.accessToken && tokens?.refreshToken) {
        setTokens(tokens.accessToken, tokens.refreshToken);
      }
    }
    return response;
  },

  logout: async () => {
    await apiFetch('/auth/logout', { method: 'POST', auth: true });
    clearTokens();
  },

  getMe: () => apiFetch('/auth/me', { auth: true }),

  getUsers: () => apiFetch('/auth/users', { auth: true }),

  createUser: (data: { email: string; password: string; name: string; role: string }) =>
    apiFetch('/auth/users', { method: 'POST', body: data, auth: true }),

  updateUserStatus: (id: string, isActive: boolean) =>
    apiFetch(`/auth/users/${id}/status`, { method: 'PATCH', body: { isActive }, auth: true }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch('/auth/password', { method: 'PUT', body: { currentPassword, newPassword }, auth: true }),
};

// ============ POSTS API ============
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPremium: boolean;
  viewCount: number;
  publishedAt?: string;
  createdAt: string;
  author: { id: string; name: string; slug: string; avatar?: string };
  tags: { id: string; name: string; slug: string }[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface PostsResponse {
  data: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const postsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; tag?: string; author?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.tag) query.set('tag', params.tag);
    if (params?.author) query.set('author', params.author);
    return apiFetch<PostsResponse>(`/posts?${query.toString()}`);
  },

  getBySlug: (slug: string) => apiFetch<Post>(`/posts/${slug}`),

  getById: (id: string) => apiFetch<Post>(`/posts/${id}`, { auth: true }),

  create: (data: Partial<Post> & { tagIds?: string[] }) =>
    apiFetch<Post>('/posts', { method: 'POST', body: data, auth: true }),

  update: (id: string, data: Partial<Post> & { tagIds?: string[] }) =>
    apiFetch<Post>(`/posts/${id}`, { method: 'PUT', body: data, auth: true }),

  delete: (id: string) =>
    apiFetch(`/posts/${id}`, { method: 'DELETE', auth: true }),
};

// ============ AUTHORS API ============
export interface Author {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
}

export const authorsApi = {
  getAll: () => apiFetch<Author[]>('/authors'),
  getBySlug: (slug: string) => apiFetch<Author>(`/authors/${slug}`),
  getPosts: (slug: string, page = 1) => apiFetch<PostsResponse>(`/authors/${slug}/posts?page=${page}`),
  create: (data: Partial<Author>) => apiFetch<Author>('/authors', { method: 'POST', body: data, auth: true }),
  update: (id: string, data: Partial<Author>) => apiFetch<Author>(`/authors/${id}`, { method: 'PUT', body: data, auth: true }),
  delete: (id: string) => apiFetch(`/authors/${id}`, { method: 'DELETE', auth: true }),
};

// ============ TAGS API ============
export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount?: number;
}

export const tagsApi = {
  getAll: () => apiFetch<Tag[]>('/tags'),
  getBySlug: (slug: string) => apiFetch<Tag>(`/tags/${slug}`),
  create: (data: Partial<Tag>) => apiFetch<Tag>('/tags', { method: 'POST', body: data, auth: true }),
  update: (id: string, data: Partial<Tag>) => apiFetch<Tag>(`/tags/${id}`, { method: 'PUT', body: data, auth: true }),
  delete: (id: string) => apiFetch(`/tags/${id}`, { method: 'DELETE', auth: true }),
};

// ============ NEWSLETTER API ============
export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'PENDING' | 'ACTIVE' | 'UNSUBSCRIBED' | 'BOUNCED';
  tier: 'FREE' | 'PREMIUM';
  source?: string;
  createdAt: string;
  confirmedAt?: string;
}

export interface NewsletterStats {
  total: number;
  byStatus: { ACTIVE: number; PENDING: number; UNSUBSCRIBED: number; BOUNCED?: number };
  byTier: { FREE: number; PREMIUM: number };
  last30Days: number;
}

export interface SubscribersResponse {
  data: Subscriber[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const newsletterApi = {
  // Públicos
  subscribe: (email: string, name: string, source?: string) =>
    apiFetch('/newsletter/subscribe', { method: 'POST', body: { email, name, source } }),
  unsubscribe: (email: string) =>
    apiFetch('/newsletter/unsubscribe', { method: 'POST', body: { email } }),
  confirmSubscription: (token: string) =>
    apiFetch<{ message: string }>(`/newsletter/confirm/${token}`),

  // Admin (requieren auth)
  getSubscribers: (params?: { page?: number; limit?: number; status?: string; tier?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.status) query.set('status', params.status);
    if (params?.tier) query.set('tier', params.tier);
    return apiFetch<SubscribersResponse>(`/newsletter/subscribers?${query.toString()}`, { auth: true });
  },
  getStats: () => apiFetch<NewsletterStats>('/newsletter/stats', { auth: true }),
  updateTier: (id: string, tier: 'FREE' | 'PREMIUM') =>
    apiFetch(`/newsletter/subscribers/${id}/tier`, { method: 'PATCH', body: { tier }, auth: true }),
};

// ============ DASHBOARD API ============
export interface DashboardOverview {
  posts: { total: number; published: number; drafts: number };
  authors: number;
  subscribers: { total: number; premium: number; free: number };
  totalViews: number;
  recentPosts: Post[];
}

export interface PostAnalytics {
  topPosts: Post[];
  byStatus: { PUBLISHED: number; DRAFT: number };
  viewsOverTime: { date: string; views: number }[];
}

export interface SubscriberAnalytics {
  byStatus: { ACTIVE: number; UNSUBSCRIBED: number };
  byTier: { FREE: number; PREMIUM: number };
  growth: { date: string; signups: number }[];
  topSources: { source: string; count: number }[];
}

export const dashboardApi = {
  getOverview: () => apiFetch<DashboardOverview>('/dashboard/overview', { auth: true }),
  getPostAnalytics: (days = 30) => apiFetch<PostAnalytics>(`/dashboard/posts?days=${days}`, { auth: true }),
  getSubscriberAnalytics: (days = 30) => apiFetch<SubscriberAnalytics>(`/dashboard/subscribers?days=${days}`, { auth: true }),
  getApiHealth: (hours = 24) => apiFetch(`/dashboard/api-health?hours=${hours}`, { auth: true }),
  getAuditLogs: (params?: { limit?: number; entity?: string; action?: string }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.entity) query.set('entity', params.entity);
    if (params?.action) query.set('action', params.action);
    return apiFetch(`/dashboard/audit?${query.toString()}`, { auth: true });
  },
};

// ============ UPLOAD API ============
export interface UploadedImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
  order?: number;
}

// Helper for file uploads with token refresh
async function uploadFetch<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
  let token = getAccessToken();
  
  const makeRequest = async (authToken: string | null) => {
    const headers: Record<string, string> = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
  };

  try {
    let response = await makeRequest(token);
    
    // If 401, try to refresh token
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        response = await makeRequest(newToken);
      } else {
        clearTokens();
        return { success: false, message: 'Sesión expirada. Por favor inicia sesión de nuevo.' };
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Upload] Error:', error);
    return { success: false, message: 'Error de conexión al subir archivo' };
  }
}

export const uploadApi = {
  uploadAvatar: async (entityId: string, file: File, type: 'author' | 'user' = 'author'): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadFetch(`/upload/avatar/${entityId}?type=${type}`, formData);
  },

  uploadCover: async (postId: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadFetch(`/upload/cover/${postId}`, formData);
  },

  uploadContentImage: async (postId: string, file: File, alt?: string, caption?: string): Promise<ApiResponse<UploadedImage>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) formData.append('alt', alt);
    if (caption) formData.append('caption', caption);
    return uploadFetch(`/upload/image/${postId}`, formData);
  },

  getPostImages: async (postId: string): Promise<ApiResponse<UploadedImage[]>> => {
    return apiFetch<UploadedImage[]>(`/upload/images/${postId}`, { auth: true });
  },

  deleteImage: async (imageId: string): Promise<ApiResponse<void>> => {
    return apiFetch(`/upload/image/${imageId}`, { method: 'DELETE', auth: true });
  },

  uploadMemberPhoto: async (memberId: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadFetch(`/upload/member/${memberId}`, formData);
  },
};

// ============ MEMBERS API ============
export type MemberCategory = "FUNDADORES" | "TITULARES" | "ASOCIADOS";

export interface Member {
  id: string;
  slug: string;
  name: string;
  position: string;
  category: MemberCategory;
  bio: string;
  image: string;
  whatsapp: string | null;
  website: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMemberDto {
  name: string;
  position: string;
  category: MemberCategory;
  bio: string;
  image: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface UpdateMemberDto extends Partial<CreateMemberDto> {}

export const membersApi = {
  // Public endpoints
  getAll: (category?: MemberCategory) => {
    const query = category ? `?category=${category}` : '';
    return apiFetch<Member[]>(`/members${query}`);
  },

  getBySlug: (slug: string) => apiFetch<Member>(`/members/${slug}`),

  getSlugs: () => apiFetch<string[]>('/members/slugs'),

  // Admin endpoints
  getAllAdmin: () => apiFetch<Member[]>('/members/admin', { auth: true }),

  create: (data: CreateMemberDto) =>
    apiFetch<Member>('/members', { method: 'POST', body: data, auth: true }),

  update: (id: string, data: UpdateMemberDto) =>
    apiFetch<Member>(`/members/${id}`, { method: 'PUT', body: data, auth: true }),

  delete: (id: string) =>
    apiFetch(`/members/${id}`, { method: 'DELETE', auth: true }),

  toggle: (id: string) =>
    apiFetch<Member>(`/members/${id}/toggle`, { method: 'PATCH', auth: true }),
};

// Export helpers
export { getAccessToken, getRefreshToken, setTokens, clearTokens };
