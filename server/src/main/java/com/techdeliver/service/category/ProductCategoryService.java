package com.techdeliver.service.category;

import com.techdeliver.dto.ProductCategoryDto;
import com.techdeliver.dto.ProductDto;
import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.exception.AlreadyExistsException;
import com.techdeliver.exception.ResourceNotFoundException;
import com.techdeliver.repository.ProductCategoryRepository;
import com.techdeliver.request.AddCategoryRequest;
import com.techdeliver.request.UpdateCategoryRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductCategoryService implements IProductCategoryService {

    private final ProductCategoryRepository categoryRepository;

    private final ModelMapper modelMapper;

//    public ProductCategoryEntity getCategoryByName(String categoryName) {
//        return categoryRepository.findByCategoryName(categoryName)
//                .orElseThrow(() ->
//                        new EntityNotFoundException("Category with name " + categoryName + " not found"));
//    }

    @Override
    public ProductCategoryEntity getCategoryById(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Категория с id "+ categoryId + "не найдена."));
    }

    @Override
    public Optional<ProductCategoryEntity> getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName);
    }

    @Override
    public ProductCategoryEntity createCategory(AddCategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getName())) {
            throw new AlreadyExistsException("Category with name " + request.getName() + " already exists.");
        }

        var category = new ProductCategoryEntity(
                request.getName(),
                request.getDescription());

        return categoryRepository.save(category);
    }

    @Override
    public ProductCategoryEntity addCategory(String categoryName) { //TODO: maybe should throws exceptions
        var category = new ProductCategoryEntity(categoryName);
        return categoryRepository.save(category);
    }

    @Override
    public ProductCategoryEntity updateCategory(UUID categoryId, UpdateCategoryRequest request) {
        return Optional.ofNullable(getCategoryById(categoryId))
                .map(c -> {
                    c.setCategoryName(request.getName());
                    c.setCategoryDescription(request.getDescription());
                    c.setInstallationComplexityCoefficient(request.getInstallationComplexityCoefficient());
                    return categoryRepository.save(c);
                }).orElseThrow(() ->
                        new ResourceNotFoundException("Категория с id "+ categoryId + "не найдена."));
    }

    @Override
    public void deleteCategory(UUID categoryId) {
        categoryRepository.deleteById(categoryId);
    }

    @Override
    public List<ProductCategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<ProductCategoryDto> getConvertedCategories(List<ProductCategoryEntity> categories) {
        return categories.stream().map(this::convertToDto).toList();
    }

    @Override
    public ProductCategoryDto convertToDto(ProductCategoryEntity category) {
        ProductCategoryDto categoryDto = modelMapper.map(category, ProductCategoryDto.class);

        List<ProductDto> productDtos = category.getProducts()
                .stream()
                .map(p -> modelMapper.map(p, ProductDto.class)).toList();

        categoryDto.setProducts(productDtos);
        return categoryDto;
    }

}
