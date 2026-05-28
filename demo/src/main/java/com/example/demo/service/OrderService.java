package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.*;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    public OrderDto createOrder(Long userId, List<OrderItemRequestDto> items) {
        User user = userService.getById(userId);

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status("NEW")
                .build();

        for (OrderItemRequestDto itemRequest : items) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Товар с id " + itemRequest.getProductId() + " не найден"));

            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Недостаточно товара: " + product.getName());
            }

            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .priceAtOrder(product.getPrice())
                    .build();

            order.getOrderItems().add(orderItem);
        }

        Order saved = orderRepository.save(order);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public OrderDto getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ с id " + id + " не найден"));
        return toDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAll() {
        return orderRepository.findAll().stream().map(this::toDto).toList();
    }

    public OrderDto updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заказ с id " + id + " не найден"));
        order.setStatus(status);
        return toDto(orderRepository.save(order));
    }

    // ===== Преобразование =====

    private OrderDto toDto(Order order) {
        List<OrderItemDto> items = order.getOrderItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .priceAtOrder(item.getPriceAtOrder())
                        .finalPrice(item.getFinalPrice())
                        .build())
                .toList();

        return OrderDto.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .username(order.getUser().getUsername())
                .totalAmount(order.getTotalAmount())
                .items(items)
                .build();
    }
}