package com.example.demo.repository;

import com.example.demo.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Все заказы пользователя
    List<Order> findByUserId(Long userId);

    // Заказы по статусу
    List<Order> findByStatus(String status);

    // Заказы с суммой больше указанной
    @Query("SELECT o FROM Order o JOIN o.orderItems oi " +
           "GROUP BY o HAVING SUM(oi.priceAtOrder * oi.quantity) >= :minAmount")
    List<Order> findOrdersWithMinAmount(@Param("minAmount") Double minAmount);
}