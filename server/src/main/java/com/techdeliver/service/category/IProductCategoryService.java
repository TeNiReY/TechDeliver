package com.techdeliver.service.category;

import com.techdeliver.dto.ProductCategoryDto;
import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.request.AddCategoryRequest;
import com.techdeliver.request.UpdateCategoryRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IProductCategoryService {


    ProductCategoryEntity getCategoryById(UUID categoryId);

    Optional<ProductCategoryEntity> getCategoryByName(String categoryName);

    ProductCategoryEntity createCategory(AddCategoryRequest request);

    ProductCategoryEntity addCategory(String categoryName);

    ProductCategoryEntity updateCategory(UUID categoryId, UpdateCategoryRequest request);

    void deleteCategory(UUID categoryId);

    List<ProductCategoryEntity> getAllCategories();

    List<ProductCategoryDto> getConvertedCategories(List<ProductCategoryEntity> categories);

    ProductCategoryDto convertToDto(ProductCategoryEntity category);
}
