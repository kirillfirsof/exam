import { useState, useEffect } from 'react';
import { getProducts, createOrder, getUsername } from '../api';

export default function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const load = async () => {
        const params = {};
        if (search) params.name = search;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        const data = await getProducts(params);
        setProducts(data);
    };

    useEffect(() => { load(); }, []);

    const addToCart = (product) => {
        const existing = cart.find(i => i.productId === product.id);
        if (existing) {
            setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(i => i.productId !== productId));
    };

    const handleOrder = async () => {
        if (cart.length === 0) return alert('Корзина пуста');
        try {
            await createOrder({
                userId: 1,  // TODO: получать реальный userId
                items: cart.map(i => ({ productId: i.productId, quantity: i.quantity }))
            });
            alert('Заказ создан!');
            setCart([]);
        } catch (e) {
            alert(e.message);
        }
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Список товаров */}
            <div className="flex-1">
                <h2 className="text-xl font-bold mb-4">Каталог товаров</h2>

                {/* Фильтры */}
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                    <input className="border p-2 rounded flex-1" placeholder="Поиск по названию..."
                        value={search} onChange={e => setSearch(e.target.value)} />
                    <input className="border p-2 rounded w-24" type="number" placeholder="Цена от"
                        value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                    <input className="border p-2 rounded w-24" type="number" placeholder="до"
                        value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                    <button onClick={load} className="bg-blue-500 text-white px-4 py-2 rounded">Найти</button>
                </div>

                {/* Сетка товаров */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                        <div key={p.id} className="bg-white p-4 rounded shadow">
                            <h3 className="font-bold">{p.name}</h3>
                            <p className="text-sm text-gray-500">{p.description}</p>
                            <p className="text-lg font-bold mt-1">{p.price} ₽</p>
                            {p.discount && (
                                <p className="text-sm text-red-500">
                                    Скидка {p.discount.type === 'PERCENT' ? p.discount.value + '%' : p.discount.value + ' ₽'}
                                </p>
                            )}
                            <button onClick={() => addToCart(p)}
                                className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm">
                                В корзину
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Корзина */}
            <div className="w-full lg:w-80 bg-white p-4 rounded shadow h-fit sticky top-4">
                <h3 className="font-bold text-lg mb-2">Корзина</h3>
                {cart.length === 0 && <p className="text-gray-400 text-sm">Пусто</p>}
                {cart.map(i => (
                    <div key={i.productId} className="flex justify-between items-center text-sm mb-1">
                        <span>{i.name} x{i.quantity}</span>
                        <button onClick={() => removeFromCart(i.productId)} className="text-red-500">✕</button>
                    </div>
                ))}
                {cart.length > 0 && (
                    <>
                        <p className="font-bold mt-2">Итого: {total} ₽</p>
                        <button onClick={handleOrder}
                            className="mt-2 bg-blue-500 text-white w-full py-2 rounded">
                            Оформить заказ
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}