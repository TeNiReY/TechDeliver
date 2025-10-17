package com.techdeliver.dto;

import com.techdeliver.entity.ProductCategoryEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private UUID productId;
    private ProductCategoryDto productCategory; //TODO: here errror (null fields)
    private String productName;
    private BigDecimal price;
    private int inventory;
    private String productBrand;
    private String productModel;
    private float productWeight;
    private float productWidth;
    private float productLength;
    private float productHeight;
    private String productDescription;
    private List<ImageDto> images;
}
