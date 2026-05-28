package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double priceAtOrder;  // цена на момент заказа

    // Связь: позиция → заказ (многие к одному)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Связь: позиция → товар (многие к одному)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Итоговая цена с учётом скидки товара
    public Double getFinalPrice() {
        if (product != null && product.getDiscount() != null) {
            return product.getDiscount().applyDiscount(priceAtOrder) * quantity;
        }
        return priceAtOrder * quantity;
    }
}