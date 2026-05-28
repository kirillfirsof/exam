import { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../api';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ fullName: '', email: '', role: 'USER' });

    const load = () => getUsers().then(setUsers);

    useEffect(() => { load(); }, []);

    const handleEdit = (u) => {
        setForm({ fullName: u.fullName || '', email: u.email, role: u.role });
        setEditingId(u.id);
    };

    const handleSave = async () => {
        await updateUser(editingId, form);
        setEditingId(null);
        load();
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">Управление пользователями</h2>
            {users.map(u => (
                <div key={u.id} className="bg-white p-4 rounded shadow mb-2 flex flex-col sm:flex-row justify-between gap-2">
                    {editingId === u.id ? (
                        <div className="flex flex-col sm:flex-row gap-2 flex-1">
                            <input className="border p-1 rounded flex-1" placeholder="ФИО" value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })} />
                            <input className="border p-1 rounded flex-1" placeholder="Email" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                            <select className="border p-1 rounded" value={form.role}
                                onChange={e => setForm({ ...form, role: e.target.value })}>
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            <button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">Сохранить</button>
                            <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded">Отмена</button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <span className="font-bold">{u.username}</span>
                                <span className="text-sm text-gray-500 ml-2">{u.fullName}</span>
                                <span className={`ml-2 text-xs px-2 py-0.5 rounded ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {u.role}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(u)}
                                    className="bg-yellow-400 text-white px-2 py-1 rounded text-sm">Изменить</button>
                                <button onClick={() => { deleteUser(u.id); load(); }}
                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm">Удалить</button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}