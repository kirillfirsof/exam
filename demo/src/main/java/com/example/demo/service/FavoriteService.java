package com.example.demo.service;

import com.example.demo.dto.ProductDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SecurityUtils securityUtils;
    private final ProductService productService; // чтобы конвертировать в DTO

    public List<ProductDto> getMyFavorites() {
        User user = securityUtils.getCurrentUser();
        return user.getFavorites().stream()
                .map(productService::toDto) // используем toDto из ProductService
                .toList();
    }

    public List<ProductDto> addToFavorites(Long productId) {
        User user = securityUtils.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Товар не найден"));

        user.getFavorites().add(product);
        userRepository.save(user);

        return getMyFavorites(); // возвращаем обновлённый список
    }

    public List<ProductDto> removeFromFavorites(Long productId) {
        User user = securityUtils.getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Товар не найден"));

        user.getFavorites().remove(product);
        userRepository.save(user);

        return getMyFavorites();
    }

    public boolean isFavorite(Long productId) {
        User user = securityUtils.getCurrentUser();
        return user.getFavorites().stream()
                .anyMatch(p -> p.getId().equals(productId));
    }
}