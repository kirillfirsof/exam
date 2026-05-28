package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "discounts")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Тип скидки: PERCENT или FIXED
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DiscountType type;

    // Значение: 15 (%) или 500 (рублей)
    @Column(nullable = false)
    private Double value;

    // Обратная связь к товару
    @OneToOne
    @JoinColumn(name = "product_id", unique = true)
    @JsonIgnore 
    @ToString.Exclude
    private Product product;

    // Вычисляем цену со скидкой
    public Double applyDiscount(Double originalPrice) {
        if (type == DiscountType.PERCENT) {
            return originalPrice * (1 - value / 100);
        } else {
            return Math.max(0, originalPrice - value);
        }
    }
}