const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || 'Something went wrong',
    );
  }

  return data;
}

export function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function loginUser(data: {
  email: string;
  password: string;
}) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function logoutUser() {
  return request('/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return request('/auth/me');
}

export function getUsers() {
  return request('/users');
}

export function getUser(id: string) {
  return request(`/users/${id}`);
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
  },
) {
  return request(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteUser(id: string) {
  return request(`/users/${id}`, {
    method: 'DELETE',
  });
}