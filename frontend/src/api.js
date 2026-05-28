const API = 'http://localhost:8080/api';

export const setToken = (token) => localStorage.setItem('token', token);
export const getToken = () => localStorage.getItem('token');
export const getUsername = () => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub;
    } catch { return null; }
};

async function authFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
    const res = await fetch(`${API}${url}`, { ...options, headers });
    const text = await res.text();
    if (!text) return null;
    const data = JSON.parse(text);
    if (!res.ok) {
        if (data.details) {
            const messages = Object.entries(data.details).map(([f, m]) => `${f}: ${m}`).join('\n');
            throw new Error(messages);
        }
        throw new Error(data.error || 'Ошибка запроса');
    }
    return data;
}

// Auth
export const login = (data) => authFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) });
export const register = (data) => authFetch('/auth/register', { method: 'POST', body: JSON.stringify(data) });

// Products
export const getProducts = (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return authFetch(`/products/filter?${query}`);
};
export const createProduct = (data) => authFetch('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id, data) => authFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id) => authFetch(`/products/${id}`, { method: 'DELETE' });
export const getProductById = (id) => authFetch(`/products/${id}`);

// Orders
export const getMyOrders = () => authFetch('/orders/my');
export const getAllOrders = () => authFetch('/orders');
export const getOrderById = (id) => authFetch(`/orders/${id}`);
export const createOrder = (data) => authFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
export const updateOrderStatus = (id, status) =>
    authFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

// Admin
export const getUsers = () => authFetch('/admin/users');
export const updateUser = (id, data) => authFetch(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteUser = (id) => authFetch(`/admin/users/${id}`, { method: 'DELETE' });


// Favorites
export const getFavorites = () => authFetch('/favorites');
export const addToFavorites = (productId) => authFetch(`/favorites/${productId}`, { method: 'POST' });
export const removeFromFavorites = (productId) => authFetch(`/favorites/${productId}`, { method: 'DELETE' });
export const isFavorite = (productId) => authFetch(`/favorites/${productId}/is-favorite`);