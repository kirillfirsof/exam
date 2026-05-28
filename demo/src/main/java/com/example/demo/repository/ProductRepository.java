package com.example.demo.repository;

import com.example.demo.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Поиск по названию (содержит подстроку, без учёта регистра)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Все товары со скидкой
    @Query("SELECT p FROM Product p WHERE p.discount IS NOT NULL")
    List<Product> findDiscountedProducts();

    // Фильтрация по диапазону цен
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);

    // Поиск по названию И диапазону цен
    @Query("SELECT p FROM Product p WHERE " +
        "(:name IS NULL OR LOWER(CAST(p.name AS text)) LIKE LOWER(CONCAT('%', CAST(:name AS text), '%'))) AND " +
        "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
        "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Product> findWithFilters(@Param("name") String name,
                                @Param("minPrice") Double minPrice,
                                @Param("maxPrice") Double maxPrice);
}