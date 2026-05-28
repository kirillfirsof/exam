import { useState } from 'react';
import { register } from '../api';

export default function RegisterPage({ onSwitch }) {
    const [form, setForm] = useState({ username: '', password: '', email: '', fullName: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };

    if (success) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow text-center">
                <h2 className="text-xl font-bold text-green-600">Регистрация успешна!</h2>
                <button onClick={onSwitch} className="mt-4 text-blue-500">Перейти ко входу</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input className="border p-2 w-full mb-2 rounded" placeholder="Логин" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                <input className="border p-2 w-full mb-2 rounded" type="password" placeholder="Пароль" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <input className="border p-2 w-full mb-2 rounded" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                <input className="border p-2 w-full mb-2 rounded" placeholder="ФИО" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                <button className="bg-green-500 text-white w-full py-2 rounded">Зарегистрироваться</button>
                <p className="mt-2 text-center text-sm">
                    Уже есть аккаунт? <button type="button" onClick={onSwitch} className="text-blue-500">Войти</button>
                </p>
            </form>
        </div>
    );
}