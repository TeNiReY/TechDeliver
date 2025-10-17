package com.techdeliver.controller;

import com.techdeliver.dto.ProductCategoryDto;
import com.techdeliver.service.category.IProductCategoryService;
import com.techdeliver.util.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class CategoryController {

    private final IProductCategoryService categoryService;

//    @QueryMapping
//    public CategoryListResponse getAllCategories() {
//        var categories = categoryService.getAllCategories();
//
//        return new CategoryListResponse(
//                categories.stream()
//                .map(CategoryMapper::mapToDto).toList(),
//                "Get all categories success!");
//    }
//
//    @QueryMapping
//    public List<ProductCategoryDto> categories() {
//        var categories = categoryService.getAllCategories();
//        return categories.stream()
//                .map(CategoryMapper::mapToDto).toList();
//    }


//    @QueryMapping
//    public CategoryResponse getCategoryByName(@Argument String name) {
//
//        var category = categoryService.getCategoryByName(name);
//
//        return CategoryResponse(CategoryMapper.mapToDto(category), )
//
//
//    }

    public record CategoryResponse(ProductCategoryDto categoryDto,
                                   String message) {}

    public record CategoryListResponse(List<ProductCategoryDto> categories,
                                       String message) {}

}
