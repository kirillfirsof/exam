import { useState, useEffect } from 'react';
import { getFavorites, removeFromFavorites } from '../api';

export default function FavoritesPage() {
    const [products, setProducts] = useState([]);

    const load = async () => {
        try {
            const data = await getFavorites();
            setProducts(data);
        } catch (e) {
            setProducts([]);
        }
    };

    useEffect(() => { load(); }, []);

    const handleRemove = async (productId) => {
        await removeFromFavorites(productId);
        load();
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">+ Избранное</h2>
            {products.length === 0 && (
                <p className="text-gray-400">Нет избранных товаров</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="text-sm text-gray-500">{p.description}</p>
                        <p className="text-lg font-bold mt-1">{p.price} ₽</p>
                        <button
                            onClick={() => handleRemove(p.id)}
                            className="mt-2 text-red-500 text-sm hover:underline"
                        >
                            Удалить из избранного
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}