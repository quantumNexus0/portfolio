const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('portfolio_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    }
  },
  posts: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/posts`, { headers: getHeaders() });
      return res.json();
    },
    create: async (postData) => {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      return res.json();
    },
    update: async (id, postData) => {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(postData)
      });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    }
  },
  projects: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/projects`, { headers: getHeaders() });
      return res.json();
    },
    create: async (projectData) => {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(projectData)
      });
      return res.json();
    },
    update: async (id, projectData) => {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(projectData)
      });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    }
  },
  profile: {
    get: async (userId) => {
      const res = await fetch(`${API_URL}/profile/${userId}`, { headers: getHeaders() });
      return res.json();
    },
    upsert: async (profileData) => {
      const res = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(profileData)
      });
      return res.json();
    }
  },
  about: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/about`, { headers: getHeaders() });
      return res.json();
    },
    create: async (aboutData) => {
      const res = await fetch(`${API_URL}/about`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(aboutData)
      });
      return res.json();
    },
    update: async (id, aboutData) => {
      const res = await fetch(`${API_URL}/about/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(aboutData)
      });
      return res.json();
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/about/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      return res.json();
    }
  }
};
