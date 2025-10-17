package com.techdeliver.service.category;

import com.techdeliver.entity.ProductCategoryEntity;

import java.util.List;
import java.util.Optional;

public interface IProductCategoryService {



    Optional<ProductCategoryEntity> getCategoryByName(String categoryName);

    ProductCategoryEntity createCategory(String categoryName);

    List<ProductCategoryEntity> getAllCategories();
}
