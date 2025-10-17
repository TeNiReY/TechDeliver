package com.techdeliver.dto;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductCategoryDto {
    private UUID id;
    private String name;
    private String description;
    private List<ProductDto> products;
}
