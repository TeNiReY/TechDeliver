package com.techdeliver.controller;

import com.techdeliver.dto.ProductCategoryDto;
import com.techdeliver.request.AddCategoryRequest;
import com.techdeliver.service.category.IProductCategoryService;
import com.techdeliver.service.category.ProductCategoryService;
import com.techdeliver.util.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class CategoryController {

    private final IProductCategoryService categoryService;
    private final ProductCategoryService productCategoryService;

    @QueryMapping
    public CategoryListResponse getAllCategories() {
        var categories = categoryService.getAllCategories();

        return new CategoryListResponse(
                productCategoryService.getConvertedCategories(categories),
                "Get all categories success!");
    }

    @QueryMapping
    public CategoryResponse getCategoryById(@Argument UUID categoryId) {

        var category = categoryService.getCategoryById(categoryId);

        return new CategoryResponse(
                productCategoryService.convertToDto(category),
                "Get category success!" );
    }

    @MutationMapping
    public CategoryResponse createCategory(@Argument AddCategoryRequest input) {

        var createdCategory = categoryService.createCategory(input);
        return new CategoryResponse(
                productCategoryService.convertToDto(createdCategory),
                "Create category success!");
    }

    public record CategoryResponse(ProductCategoryDto categoryDto,
                                   String message) {}

    public record CategoryListResponse(List<ProductCategoryDto> categories,
                                       String message) {}

}
