package com.techdeliver.request;

import com.techdeliver.entity.ProductCategoryEntity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class AddProductRequest {
    private String name;
    private ProductCategoryEntity category;
    private BigDecimal price;
    private int quantity;
    private String brand;
    private String model;
    private float weight;
    private float width;
    private float length;
    private float height;
    private String description;
}
