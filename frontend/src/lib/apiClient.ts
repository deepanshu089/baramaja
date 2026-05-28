let BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

if (BASE_URL && !BASE_URL.endsWith('/api') && !BASE_URL.endsWith('/api/')) {
  BASE_URL = BASE_URL.endsWith('/') ? `${BASE_URL}api` : `${BASE_URL}/api`;
}

const cleanUrl = (base: string, path: string) => {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('baramaja_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(cleanUrl(BASE_URL, endpoint), {
      method: 'GET',
      headers: getHeaders(),
    });
    return res.json();
  },
  post: async (endpoint: string, data: any) => {
    const res = await fetch(cleanUrl(BASE_URL, endpoint), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  put: async (endpoint: string, data: any) => {
    const res = await fetch(cleanUrl(BASE_URL, endpoint), {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  patch: async (endpoint: string, data?: any) => {
    const res = await fetch(cleanUrl(BASE_URL, endpoint), {
      method: 'PATCH',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
    return res.json();
  },
  delete: async (endpoint: string) => {
    const res = await fetch(cleanUrl(BASE_URL, endpoint), {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return res.json();
  }
};
