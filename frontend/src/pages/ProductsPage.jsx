import { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct } from '../api';

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Фильтры
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [discountedOnly, setDiscountedOnly] = useState(false);

    // Форма добавления
    const [showForm, setShowForm] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '' });

    const loadProducts = async () => {
        setLoading(true);
        setError('');
        try {
            // Собираем параметры для фильтрации
            const params = new URLSearchParams();
            if (search) params.append('name', search);
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice) params.append('maxPrice', maxPrice);

            let url = '/products';
            if (params.toString()) url += '/filter?' + params.toString();

            const data = await getProducts(url);
            setProducts(discountedOnly ? data.filter(p => p.discount) : data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        loadProducts();
    };

    const handleReset = () => {
        setSearch('');
        setMinPrice('');
        setMaxPrice('');
        setDiscountedOnly(false);
        // После сброса загружаем все товары
        setTimeout(() => loadProducts(), 0);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createProduct({
                name: newProduct.name,
                description: newProduct.description,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock)
            });
            setNewProduct({ name: '', description: '', price: '', stock: '' });
            setShowForm(false);
            loadProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Удалить товар?')) return;
        try {
            await deleteProduct(id);
            loadProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold">Товары</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {showForm ? 'Отмена' : '+ Добавить товар'}
                </button>
            </div>

            {/* Форма добавления */}
            {showForm && (
                <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow mb-6">
                    <h3 className="font-bold mb-3">Новый товар</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <input className="border p-2 rounded" placeholder="Название *" required
                            value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                        <input className="border p-2 rounded" placeholder="Описание"
                            value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                        <input className="border p-2 rounded" type="number" step="0.01" placeholder="Цена *" required
                            value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                        <input className="border p-2 rounded" type="number" placeholder="Остаток *" required
                            value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} />
                    </div>
                    <button className="mt-3 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                        Сохранить
                    </button>
                </form>
            )}

            {/* Фильтры и поиск */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <input className="border p-2 rounded" placeholder="Поиск по названию..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                    <input className="border p-2 rounded" type="number" placeholder="Цена от"
                        value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                    <input className="border p-2 rounded" type="number" placeholder="Цена до"
                        value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                    <label className="flex items-center gap-2 p-2">
                        <input type="checkbox" checked={discountedOnly}
                            onChange={e => setDiscountedOnly(e.target.checked)} />
                        Только со скидкой
                    </label>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                        Найти
                    </button>
                    <button type="button" onClick={handleReset}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400">
                        Сбросить
                    </button>
                </div>
            </form>

            {/* Ошибки */}
            {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4">{error}</div>
            )}

            {/* Загрузка */}
            {loading && <p className="text-gray-500 text-center py-8">Загрузка...</p>}

            {/* Сетка товаров */}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.length === 0 && (
                        <p className="text-gray-500 col-span-full text-center py-8">Товары не найдены</p>
                    )}
                    {products.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{p.name}</h3>
                                {p.discount && (
                                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                                        -{p.discount.value}{p.discount.type === 'PERCENT' ? '%' : '₽'}
                                    </span>
                                )}
                            </div>
                            {p.description && (
                                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{p.description}</p>
                            )}
                            <div className="flex justify-between items-center">
                                <div>
                                    {p.discount ? (
                                        <div>
                                            <span className="text-gray-400 line-through text-sm">{p.price} ₽</span>
                                            <span className="text-red-600 font-bold ml-2">
                                                {p.discount.type === 'PERCENT'
                                                    ? (p.price * (1 - p.discount.value / 100)).toFixed(2)
                                                    : Math.max(0, p.price - p.discount.value).toFixed(2)
                                                } ₽
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-bold">{p.price} ₽</span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-400">Остаток: {p.stock}</span>
                            </div>
                            <button onClick={() => handleDelete(p.id)}
                                className="mt-3 text-red-500 text-sm hover:text-red-700">
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}