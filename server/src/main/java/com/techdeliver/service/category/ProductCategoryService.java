package com.techdeliver.service.category;

import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductCategoryService implements IProductCategoryService {

    private final ProductCategoryRepository categoryRepository;

//    public ProductCategoryEntity getCategoryByName(String categoryName) {
//        return categoryRepository.findByCategoryName(categoryName)
//                .orElseThrow(() ->
//                        new EntityNotFoundException("Category with name " + categoryName + " not found"));
//    }

    @Override
    public Optional<ProductCategoryEntity> getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }

    @Override
    public ProductCategoryEntity createCategory(String categoryName) { //TODO: maybe should throws exceptions
        var category = new ProductCategoryEntity(categoryName);
        return categoryRepository.save(category);
    }

    @Override
    public List<ProductCategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

}
