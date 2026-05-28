package com.example.demo.config;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import com.example.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DiscountRepository discountRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public void run(String... args) {
        // Не создаём повторно, если данные уже есть
        if (userRepository.count() > 0) return;

        // ===== 1. Пользователи =====
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .email("admin@shop.ru")
                .fullName("Администратор Системы")
                .role(Role.ADMIN)
                .build();

        User user = User.builder()
                .username("user")
                .password(passwordEncoder.encode("user123"))
                .email("user@shop.ru")
                .fullName("Иванов Иван Иванович")
                .role(Role.USER)
                .build();

        userRepository.save(admin);
        userRepository.save(user);

        // Вывод токенов в консоль для быстрого копирования
        System.out.println("============================================");
        System.out.println("ТОКЕН АДМИНА: " + jwtUtil.generateToken("admin", "ADMIN"));
        System.out.println("ТОКЕН ПОЛЬЗОВАТЕЛЯ: " + jwtUtil.generateToken("user", "USER"));
        System.out.println("============================================");

        // ===== 2. Товары =====
        Product notebook = Product.builder()
                .name("Ноутбук игровой")
                .description("RTX 4060, 16GB RAM, 512GB SSD")
                .price(120000.0)
                .stock(10)
                .build();

        Product phone = Product.builder()
                .name("Смартфон")
                .description("6.7 дюймов, 256GB, 5G")
                .price(85000.0)
                .stock(25)
                .build();

        Product headphones = Product.builder()
                .name("Наушники беспроводные")
                .description("Bluetooth 5.3, шумоподавление")
                .price(15000.0)
                .stock(50)
                .build();

        Product monitor = Product.builder()
                .name("Монитор 27\"")
                .description("4K, IPS, 144Hz")
                .price(45000.0)
                .stock(15)
                .build();

        Product keyboard = Product.builder()
                .name("Клавиатура механическая")
                .description("Cherry MX Red, RGB подсветка")
                .price(8500.0)
                .stock(40)
                .build();

        Product mouse = Product.builder()
                .name("Мышь беспроводная")
                .description("Эргономичная, до 70 дней без подзарядки")
                .price(6500.0)
                .stock(60)
                .build();

        productRepository.saveAll(java.util.List.of(
                notebook, phone, headphones, monitor, keyboard, mouse));

        // ===== 3. Скидки =====
        Discount discount1 = Discount.builder()
                .type(DiscountType.PERCENT)
                .value(15.0)
                .product(notebook)
                .build();

        Discount discount2 = Discount.builder()
                .type(DiscountType.FIXED)
                .value(5000.0)
                .product(phone)
                .build();
    
        discountRepository.saveAll(java.util.List.of(discount1, discount2));


        System.out.println("Товаров создано: " + productRepository.count());
        System.out.println("Пользователей создано: " + userRepository.count());
    }
}