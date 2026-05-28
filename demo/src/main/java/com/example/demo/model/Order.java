package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    @Builder.Default
    private String status = "NEW";  // NEW, PROCESSING, SHIPPED, DELIVERED

    // Связь: заказ → пользователь (многие к одному)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Связь: заказ → позиции заказа (один ко многим)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    // Вычисляемая сумма заказа
    public Double getTotalAmount() {
        return orderItems.stream()
                .mapToDouble(OrderItem::getFinalPrice)
                .sum();
    }
}