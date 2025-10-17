package com.techdeliver.service.product;

import com.techdeliver.dto.ProductDto;
import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.entity.ProductEntity;
import com.techdeliver.request.AddProductRequest;
import com.techdeliver.request.UpdateProductRequest;

import java.util.List;
import java.util.UUID;

public interface IProductService {


    ProductEntity getProductById(UUID id);

    ProductEntity getProductsByName(String name);

    List<ProductEntity> getProductsByCategory(ProductCategoryEntity category);

    List<ProductEntity> getProductsByBrand(String brand);

    List<ProductEntity> getProductsByModel(String model);

    ProductEntity addProduct(AddProductRequest request);

    ProductEntity updateProduct(UUID id, UpdateProductRequest request);

    void deleteProduct(UUID id);

    List<ProductDto> getConvertedProducts(List<ProductEntity> products);

    ProductDto convertToDto(ProductEntity product);
}
