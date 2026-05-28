import { useState, useEffect } from 'react';
import { getToken, setToken, getUsername } from './api';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminUsersPage from './pages/AdminUsersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import FavoritesPage from './pages/FavoritesPage';


export default function App() {
    const [page, setPage] = useState('catalog');
    const [token, setTokenState] = useState(getToken());
    const [role, setRole] = useState(null);
    
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setRole(payload.role || 'USER');
            } catch { setRole('USER'); }
        }
    }, [token]);

    const handleLogin = (t, r) => {
        setToken(t);
        setTokenState(t);
        setRole(r);
        setPage('catalog');
    };

    const logout = () => {
        setTokenState(null);
        setRole(null);
        localStorage.removeItem('token');
        setPage('login');
    };

    if (!token) {
        if (page === 'register') return <RegisterPage onSwitch={() => setPage('login')} />;
        return <LoginPage onLogin={handleLogin} onSwitch={() => setPage('register')} />;
    }

    const isAdmin = role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Навбар */}
            <nav className="bg-white shadow">
                <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                        <NavButton active={page === 'catalog'} onClick={() => setPage('catalog')}>
                            Каталог
                        </NavButton>
                        <NavButton active={page === 'my-orders'} onClick={() => setPage('my-orders')}>
                            Мои заказы
                        </NavButton>
                        <NavButton active={page === 'favorites'} onClick={() => setPage('favorites')}>
                            + Избранное
                        </NavButton>
                        {isAdmin && (
                            <>
                                <span className="text-gray-300 mx-1">|</span>
                                <NavButtonAdmin active={page === 'admin-products'} onClick={() => setPage('admin-products')}>
                                    Товары
                                </NavButtonAdmin>
                                <NavButtonAdmin active={page === 'admin-orders'} onClick={() => setPage('admin-orders')}>
                                    Заказы
                                </NavButtonAdmin>
                                <NavButtonAdmin active={page === 'admin-users'} onClick={() => setPage('admin-users')}>
                                    Пользователи
                                </NavButtonAdmin>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{getUsername()} {isAdmin && '🔧'}</span>
                        <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Выйти</button>
                    </div>
                </div>
            </nav>

            {/* Контент */}
            <main className="max-w-6xl mx-auto p-4">
                {page === 'catalog' && <CatalogPage />}
                {page === 'my-orders' && (
                    <MyOrdersPage
                        onViewOrder={(id) => {
                            setSelectedOrderId(id);
                            setPage('order-detail');
                        }}
                    />
                )}
                {page === 'admin-products' && <AdminProductsPage />}
                {page === 'admin-orders' && (
                    <AdminOrdersPage
                        onViewOrder={(id) => {
                            setSelectedOrderId(id);
                            setPage('order-detail');
                        }}
                    />
                )}
                {page === 'admin-users' && <AdminUsersPage />}
                {page === 'order-detail' && (
                    <OrderDetailPage
                        orderId={selectedOrderId}
                        onBack={() => setPage('my-orders')}
                    />
                    
                )}
                {page === 'favorites' && <FavoritesPage />}
            </main>
        </div>
    );
}

function NavButton({ active, onClick, children }) {
    return (
        <button onClick={onClick} className={`px-3 py-1 rounded text-sm font-medium transition
            ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {children}
        </button>
    );
}

function NavButtonAdmin({ active, onClick, children }) {
    return (
        <button onClick={onClick} className={`px-3 py-1 rounded text-sm font-medium transition border
            ${active ? 'bg-red-500 text-white border-red-600' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'}`}>
            {children}
        </button>
    );
}