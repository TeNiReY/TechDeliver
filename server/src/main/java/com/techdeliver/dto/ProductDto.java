package com.techdeliver.dto;

import com.techdeliver.entity.ProductCategoryEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private UUID id;
    private ProductCategoryEntity category;
    private String name;
    private BigDecimal price;
    private int inventory;
    private String brand;
    private String model;
    private float weight;
    private float width;
    private float length;
    private float height;
    private String description;
}
