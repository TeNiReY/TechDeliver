package com.techdeliver.service.category;

import com.techdeliver.dto.ProductCategoryDto;
import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.request.AddCategoryRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IProductCategoryService {


    ProductCategoryEntity getCategoryById(UUID categoryId);

    Optional<ProductCategoryEntity> getCategoryByName(String categoryName);

    ProductCategoryEntity createCategory(AddCategoryRequest request);

    ProductCategoryEntity addCategory(String categoryName);

    List<ProductCategoryEntity> getAllCategories();

    List<ProductCategoryDto> getConvertedCategories(List<ProductCategoryEntity> categories);

    ProductCategoryDto convertToDto(ProductCategoryEntity category);
}
