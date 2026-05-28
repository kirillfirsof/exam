import { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../api';

const STATUSES = ['NEW', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage({ onViewOrder }) {
    const [orders, setOrders] = useState([]);

    const load = () => getAllOrders().then(setOrders);

    useEffect(() => { load(); }, []);

    const changeStatus = async (id, status) => {
        await updateOrderStatus(id, status);
        load();
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-red-600">Управление заказами</h2>
            {orders.map(o => (
                <div key={o.id} className="bg-white p-4 rounded shadow mb-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-2">
                        <div>
                            <span className="font-bold">Заказ #{o.id}</span>
                            <span className="text-sm text-gray-500 ml-2">Пользователь: {o.user?.username}</span>
                        </div>
                        <select value={o.status}
                            onChange={e => changeStatus(o.id, e.target.value)}
                            className="border rounded px-2 py-1 text-sm">
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <p className="text-sm text-gray-500">Дата: {new Date(o.orderDate).toLocaleString()}</p>
                    <p className="font-bold">{o.totalAmount?.toFixed(2)} ₽</p>
                    <button
                        onClick={() => onViewOrder(o.id)}
                        className="mt-2 text-blue-500 text-sm hover:underline"
                    >
                        Подробнее 
                    </button>
                </div>
            ))}
        </div>
    );
}