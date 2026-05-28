package com.example.demo.dto;

import com.example.demo.model.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountDto {
    private Long id;
    private DiscountType type;
    private Double value;
}