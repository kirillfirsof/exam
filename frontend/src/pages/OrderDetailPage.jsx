import { useState, useEffect } from 'react';
import { getOrderById } from '../api';

export default function OrderDetailPage({ orderId, onBack }) {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const data = await getOrderById(orderId);
            setOrder(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 text-lg">Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded">
                <p>{error}</p>
                <button onClick={onBack} className="mt-2 text-blue-500 underline">← Назад</button>
            </div>
        );
    }

    if (!order) return null;

    const statusColors = {
        'NEW': 'bg-blue-100 text-blue-700',
        'PROCESSING': 'bg-yellow-100 text-yellow-700',
        'SHIPPED': 'bg-purple-100 text-purple-700',
        'DELIVERED': 'bg-green-100 text-green-700',
        'CANCELLED': 'bg-red-100 text-red-700',
    };

    return (
        <div>
            {/* Кнопка назад */}
            <button onClick={onBack} className="mb-4 text-blue-500 hover:underline">
                ← Назад к списку
            </button>

            {/* Заголовок */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Заказ #{order.id}</h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Дата: {new Date(order.orderDate).toLocaleString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                        <p className="text-gray-500 text-sm">
                            Пользователь: <span className="font-medium">{order.username}</span>
                        </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            {/* Таблица товаров */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
                <div className="p-4 border-b">
                    <h3 className="font-bold text-lg">Товары в заказе</h3>
                    <p className="text-gray-500 text-sm">{order.items.length} позиций</p>
                </div>

                {/* Заголовок таблицы (скрыт на телефонах) */}
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-sm text-gray-500 font-medium">
                    <div className="col-span-1">#</div>
                    <div className="col-span-3">Название</div>
                    <div className="col-span-2 text-center">Цена</div>
                    <div className="col-span-2 text-center">Кол-во</div>
                    <div className="col-span-2 text-right">Скидка</div>
                    <div className="col-span-2 text-right">Сумма</div>
                </div>

                {/* Строки таблицы */}
                {order.items.map((item, index) => (
                    <div key={item.id} className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 p-4 ${
                        index !== order.items.length - 1 ? 'border-b' : ''
                    }`}>
                        <div className="sm:col-span-1 text-sm text-gray-400">
                            <span className="sm:hidden font-medium">Позиция: </span>
                            {index + 1}
                        </div>
                        <div className="sm:col-span-3">
                            <span className="sm:hidden font-medium">Товар: </span>
                            <span className="font-medium">{item.productName}</span>
                            {item.discountPercent && (
                                <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                    -{item.discountPercent}%
                                </span>
                            )}
                        </div>
                        <div className="sm:col-span-2 sm:text-center">
                            <span className="sm:hidden font-medium">Цена: </span>
                            {item.discountAmount ? (
                                <>
                                    <span className="line-through text-gray-400 text-sm">
                                        {item.priceAtOrder.toFixed(2)} ₽
                                    </span>
                                    <span className="ml-1">
                                        {(item.priceAtOrder - item.discountAmount).toFixed(2)} ₽
                                    </span>
                                </>
                            ) : (
                                <span>{item.priceAtOrder.toFixed(2)} ₽</span>
                            )}
                        </div>
                        <div className="sm:col-span-2 sm:text-center">
                            <span className="sm:hidden font-medium">Количество: </span>
                            {item.quantity} шт.
                        </div>
                        <div className="sm:col-span-2 sm:text-right">
                            <span className="sm:hidden font-medium">Скидка: </span>
                            {item.discountAmount ? (
                                <span className="text-red-500">-{item.discountAmount.toFixed(2)} ₽</span>
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
                        </div>
                        <div className="sm:col-span-2 sm:text-right font-bold">
                            <span className="sm:hidden font-medium">Сумма: </span>
                            {item.finalPrice.toFixed(2)} ₽
                        </div>
                    </div>
                ))}
            </div>

            {/* Итого */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                    <span className="text-lg text-gray-600">Итого к оплате:</span>
                    <span className="text-2xl font-bold text-green-600">
                        {order.totalAmount.toFixed(2)} ₽
                    </span>
                </div>
            </div>
        </div>
    );
}