package com.example.demo.controller;

import com.example.demo.dto.OrderDto;
import com.example.demo.dto.OrderItemRequestDto;
import com.example.demo.security.SecurityUtils;
import com.example.demo.service.OrderService;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final SecurityUtils securityUtils;

    @PostMapping
    public OrderDto create(@RequestBody Map<String, Object> body) {
        String username = securityUtils.getCurrentUsername();
        Long userId = userService.getByUsername(username).getId();

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
        List<OrderItemRequestDto> orderItems = items.stream().map(item -> {
            OrderItemRequestDto req = new OrderItemRequestDto();
            req.setProductId(Long.valueOf(item.get("productId").toString()));
            req.setQuantity(Integer.valueOf(item.get("quantity").toString()));
            return req;
        }).toList();

        return orderService.createOrder(userId, orderItems);
    }

    @GetMapping("/my")
    public List<OrderDto> getMyOrders() {
        String username = securityUtils.getCurrentUsername();
        Long userId = userService.getByUsername(username).getId();
        return orderService.getByUser(userId);
    }

    @GetMapping
    public List<OrderDto> getAll() {
        return orderService.getAll();
    }

    @GetMapping("/{id}")
    public OrderDto getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PutMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderService.updateStatus(id, body.get("status"));
    }
}