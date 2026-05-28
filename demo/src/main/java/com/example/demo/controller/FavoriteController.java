package com.example.demo.controller;

import com.example.demo.dto.ProductDto;
import com.example.demo.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 1. Посмотреть моё избранное
    @GetMapping
    public List<ProductDto> getMyFavorites() {
        return favoriteService.getMyFavorites();
    }

    // 2. Добавить в избранное
    @PostMapping("/{productId}")
    public List<ProductDto> addToFavorites(@PathVariable Long productId) {
        return favoriteService.addToFavorites(productId);
    }

    // 3. Удалить из избранного
    @DeleteMapping("/{productId}")
    public List<ProductDto> removeFromFavorites(@PathVariable Long productId) {
        return favoriteService.removeFromFavorites(productId);
    }

    // 4. Проверить, в избранном ли товар (фронтенду надо знать, рисовать ли сердечко)
    @GetMapping("/{productId}/is-favorite")
    public boolean isFavorite(@PathVariable Long productId) {
        return favoriteService.isFavorite(productId);
    }
}