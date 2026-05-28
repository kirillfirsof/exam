package com.example.demo.service;

import com.example.demo.dto.DiscountDto;
import com.example.demo.dto.ProductDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Discount;
import com.example.demo.model.DiscountType;
import com.example.demo.model.Product;
import com.example.demo.repository.DiscountRepository;
import com.example.demo.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final DiscountRepository discountRepository;

    public ProductDto create(ProductDto dto) {
        Product product = toEntity(dto);
        Product saved = productRepository.save(product);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAll() {
        return productRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProductDto getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар с id " + id + " не найден"));
        return toDto(product);
    }

    public ProductDto update(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар с id " + id + " не найден"));
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        return toDto(productRepository.save(product));
    }

    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Товар с id " + id + " не найден"));
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> filter(String name, Double minPrice, Double maxPrice) {
        return productRepository.findWithFilters(name, minPrice, maxPrice)
                .stream().map(this::toDto).toList();
    }

    public ProductDto addDiscount(Long productId, DiscountType type, Double value) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Товар с id " + productId + " не найден"));

        Discount discount = Discount.builder()
                .type(type)
                .value(value)
                .product(product)
                .build();

        discountRepository.save(discount);
        product.setDiscount(discount);
        return toDto(productRepository.save(product));
    }

    // ===== Преобразования =====

    public ProductDto toDto(Product product) {
        DiscountDto discountDto = null;
        if (product.getDiscount() != null) {
            Discount d = product.getDiscount();
            discountDto = DiscountDto.builder()
                    .id(d.getId())
                    .type(d.getType())
                    .value(d.getValue())
                    .build();
        }

        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .discount(discountDto)
                .build();
    }

    private Product toEntity(ProductDto dto) {
        return Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock() != null ? dto.getStock() : 0)
                .build();
    }
}