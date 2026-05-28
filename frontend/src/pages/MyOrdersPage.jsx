import { useState, useEffect } from 'react';
import { getMyOrders } from '../api';

export default function MyOrdersPage({ onViewOrder }) {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        getMyOrders().then(setOrders).catch(() => {});
    }, []);

    const statusColors = {
        'NEW': 'bg-blue-100 text-blue-700',
        'PROCESSING': 'bg-yellow-100 text-yellow-700',
        'SHIPPED': 'bg-purple-100 text-purple-700',
        'DELIVERED': 'bg-green-100 text-green-700',
        'CANCELLED': 'bg-red-100 text-red-700',
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Мои заказы</h2>
            {orders.length === 0 && <p className="text-gray-400">Заказов пока нет</p>}
            {orders.map(o => (
                <div key={o.id} className="bg-white p-4 rounded shadow mb-2">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">Заказ #{o.id}</span>
                        <span className={`text-sm px-2 py-1 rounded ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}>
                            {o.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Дата: {new Date(o.orderDate).toLocaleString('ru-RU')}
                    </p>
                    <p className="font-bold mt-1">{o.totalAmount?.toFixed(2)} ₽</p>
                    <button
                        onClick={() => onViewOrder(o.id)}
                        className="mt-2 text-blue-500 text-sm hover:underline"
                    >
                        Подробнее →
                    </button>
                </div>
            ))}
        </div>
    );
}