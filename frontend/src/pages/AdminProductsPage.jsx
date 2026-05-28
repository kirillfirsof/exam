import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', description: '', price: '', stock: '' });
    const [editingId, setEditingId] = useState(null);

    const load = () => getProducts().then(setProducts);

    useEffect(() => { load(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) };
        if (editingId) {
            await updateProduct(editingId, data);
        } else {
            await createProduct(data);
        }
        setForm({ name: '', description: '', price: '', stock: '' });
        setEditingId(null);
        load();
    };

    const handleEdit = (p) => {
        setForm({ name: p.name, description: p.description || '', price: p.price.toString(), stock: p.stock.toString() });
        setEditingId(p.id);
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">Управление товарами</h2>

            {/* Форма */}
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-col sm:flex-row gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Название" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input className="border p-2 rounded flex-1" placeholder="Описание" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                <input className="border p-2 rounded w-24" type="number" placeholder="Цена" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} required />
                <input className="border p-2 rounded w-24" type="number" placeholder="Остаток" value={form.stock}
                    onChange={e => setForm({ ...form, stock: e.target.value })} required />
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                    {editingId ? 'Обновить' : 'Добавить'}
                </button>
                {editingId && (
                    <button type="button" onClick={() => { setForm({ name: '', description: '', price: '', stock: '' }); setEditingId(null); }}
                        className="bg-gray-300 px-4 py-2 rounded">Отмена</button>
                )}
            </form>

            {/* Список */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.description}</p>
                        <p className="font-bold">{p.price} ₽</p>
                        <p className="text-sm">Остаток: {p.stock}</p>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => handleEdit(p)}
                                className="bg-yellow-400 text-white px-2 py-1 rounded text-sm">Изменить</button>
                            <button onClick={() => { deleteProduct(p.id); load(); }}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm">Удалить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}