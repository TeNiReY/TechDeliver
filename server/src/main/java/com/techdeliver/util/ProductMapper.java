package com.techdeliver.util;

import com.techdeliver.dto.ProductDto;
import com.techdeliver.entity.ProductEntity;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public static ProductDto mapToDto(ProductEntity product) {
        return new ProductDto(
                product.getProductId(),
                product.getProductCategory(),
                product.getProductName(),
                product.getPrice(),
                product.getInventory(),
                product.getProductBrand(),
                product.getProductModel(),
                product.getProductWeight(),
                product.getProductWidth(),
                product.getProductLength(),
                product.getProductHeight(),
                product.getProductDescription());
    }


}
