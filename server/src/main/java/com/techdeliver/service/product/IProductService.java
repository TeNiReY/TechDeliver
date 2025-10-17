package com.techdeliver.service.product;

import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.entity.ProductEntity;
import com.techdeliver.request.AddProductRequest;
import com.techdeliver.request.UpdateProductRequest;

import java.util.List;
import java.util.UUID;

public interface IProductService {


    ProductEntity getApplianceById(UUID id);

    ProductEntity getAppliancesByName(String name);

    List<ProductEntity> getAppliancesByCategory(ProductCategoryEntity category);

    List<ProductEntity> getAppliancesByBrand(String brand);

    List<ProductEntity> getAppliancesByModel(String model);

    ProductEntity addProduct(AddProductRequest request);

    ProductEntity updateProduct(UUID id, UpdateProductRequest request);

    void deleteProduct(UUID id);
}
