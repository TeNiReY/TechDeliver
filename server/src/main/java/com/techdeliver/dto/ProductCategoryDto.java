package com.techdeliver.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategoryDto {
    private UUID categoryId;
    private String categoryName;
    private String categoryDescription;
    private double installationComplexityCoefficient;
    private List<ProductDto> products;
}
