package com.example.demo.controller;

import com.example.demo.dto.ProductDto;
import com.example.demo.model.DiscountType;
import com.example.demo.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductDto> getAll() {
        return productService.getAll();
    }

    @GetMapping("/{id}")
    public ProductDto getById(@PathVariable Long id) {
        return productService.getById(id);
    }

    @PostMapping
    public ProductDto create(@RequestBody ProductDto dto) {
        return productService.create(dto);
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductDto dto) {
        return productService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.delete(id);
    }

    @GetMapping("/filter")
    public List<ProductDto> filter(@RequestParam(required = false) String name,
                                    @RequestParam(required = false) Double minPrice,
                                    @RequestParam(required = false) Double maxPrice) {
        return productService.filter(name, minPrice, maxPrice);
    }

    @PostMapping("/{id}/discount")
    public ProductDto addDiscount(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        DiscountType type = DiscountType.valueOf(body.get("type").toString().toUpperCase());
        Double value = Double.valueOf(body.get("value").toString());
        return productService.addDiscount(id, type, value);
    }
}