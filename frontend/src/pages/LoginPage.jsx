import { useState } from 'react';
import { login } from '../api';

export default function LoginPage({ onLogin, onSwitch }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login({ username, password });
            const payload = JSON.parse(atob(data.token.split('.')[1]));
            onLogin(data.token, payload.role || 'USER');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Вход</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input className="border p-2 w-full mb-2 rounded" placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} />
                <input className="border p-2 w-full mb-2 rounded" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
                <button className="bg-blue-500 text-white w-full py-2 rounded">Войти</button>
                <p className="mt-2 text-center text-sm">
                    Нет аккаунта? <button type="button" onClick={onSwitch} className="text-blue-500">Регистрация</button>
                </p>
            </form>
        </div>
    );
}