import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface GenerateRequest {
  prompt: string;
  image?: string;
  previousCode?: string;
  stream?: boolean;
  sessionId: number;
}

export interface GenerateResponse {
  code: string;
}

export interface StreamChunk {
  type: 'chunk' | 'done' | 'error';
  content?: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  gemini_configured: boolean;
}

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: any[];
  versions: any[];
}

export interface UserProfile {
  username?: string;
  email?: string;
  avatar_url?: string | null;
}

export const login = async (username: string, password: string) => {
  const response = await api.post('/login/', { username, password });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};

export const googleLogin = async (idToken: string) => {
  const response = await api.post('/google-login/', { id_token: idToken });
  localStorage.setItem('access_token', response.data.access);
  localStorage.setItem('refresh_token', response.data.refresh);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await api.post('/register/', userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get('/sessions/');
  return response.data;
};

export const createSession = async (): Promise<ChatSession> => {
  const response = await api.post('/sessions/', { title: 'New Chat' });
  return response.data;
};

export const getSessionDetail = async (id: number): Promise<ChatSession> => {
  const response = await api.get(`/sessions/${id}/`);
  return response.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await api.delete(`/sessions/${id}/`);
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/profile/');
  return response.data;
};

export const updateProfile = async (data: UserProfile): Promise<UserProfile> => {
  const response = await api.post('/profile/', data);
  return response.data;
};

export const generateCodeStream = async (
  data: GenerateRequest,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...data, stream: true }),
    });

    if (!response.ok) {
      const err = await response.json();
      onError(err.error || 'Generation failed');
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      onError('No response stream');
      return;
    }

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed: StreamChunk = JSON.parse(line.slice(6));
            if (parsed.type === 'chunk' && parsed.content) {
              onChunk(parsed.content);
            } else if (parsed.type === 'done') {
              onDone();
            } else if (parsed.type === 'error') {
              onError(parsed.content || 'Unknown error');
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }
    }
  } catch (error: unknown) {
    onError(error instanceof Error ? error.message : 'Network error');
  }
};

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get('/health/');
  return response.data;
};

export default api;
