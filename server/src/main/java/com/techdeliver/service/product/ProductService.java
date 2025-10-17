package com.techdeliver.service.product;


import com.techdeliver.dto.ImageDto;
import com.techdeliver.dto.ProductDto;
import com.techdeliver.entity.ImageEntity;
import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.entity.ProductEntity;
import com.techdeliver.exception.AlreadyExistsException;
import com.techdeliver.exception.ResourceNotFoundException;
import com.techdeliver.repository.ImageRepository;
import com.techdeliver.repository.ProductRepository;
import com.techdeliver.request.AddProductRequest;
import com.techdeliver.request.UpdateProductRequest;
import com.techdeliver.service.category.IProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    private final IProductCategoryService categoryService;

    private final ImageRepository imageRepository;

    private final ModelMapper modelMapper;


    @Override
    public ProductEntity getProductById(UUID id) {
        return  productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appliance with id " + id + " not found"));
    }

    @Override
    public ProductEntity getProductsByName(String name) { //TODO: add elastic search
        return productRepository.findByProductName(name)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appliance with name " + name + " not found"));
    }

    @Override
    public List<ProductEntity> getProductsByCategory(ProductCategoryEntity category) {
        return productRepository.findAllByProductCategory(category);
    }

    @Override
    public List<ProductEntity> getProductsByBrand(String brand) {
       return productRepository.findAllByProductBrand(brand);
    }

    @Override
    public List<ProductEntity> getProductsByModel(String model) {
       return productRepository.findAllByProductModel(model);
    }

    @Override
    public ProductEntity addProduct(AddProductRequest request) {

        if (productExists(request.getName(), request.getBrand())) {//TODO: вместо этого кидатиь ошибку
            throw new AlreadyExistsException("Product with name " + request.getName() + " already exists. You should update product instead of add.");
        }

        ProductCategoryEntity category = categoryService
                .getCategoryByName(request.getCategory().getCategoryName())
                .orElseGet(() ->
                        categoryService.createCategory(
                                request.getCategory().getCategoryName()));

        request.setCategory(category);
        return productRepository.save(createAppliance(request));
    }

    private ProductEntity createAppliance(AddProductRequest request) {
        return new ProductEntity(
                request.getCategory(),
                request.getName(),
                request.getPrice(),
                request.getQuantity(),
                request.getBrand(),
                request.getModel(),
                request.getWeight(),
                request.getWidth(),
                request.getLength(),
                request.getHeight(),
                request.getDescription());
    }

    @Override
    public ProductEntity updateProduct(UUID id, UpdateProductRequest request) {
        return productRepository.findById(id)
                .map(appliance -> updateExistingProduct(appliance, request))
                .map(productRepository::save)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appliance with id " + id + " not found"));
    }

    private ProductEntity updateExistingProduct(ProductEntity existingProduct, UpdateProductRequest request) {
        existingProduct.setPrice(request.getPrice());
        existingProduct.setInventory(request.getInventory());
        existingProduct.setProductDescription(request.getDescription());
        return productRepository.save(existingProduct);
    }

    public boolean productExists(String name, String brand) { //TODO: maybe add model
        return productRepository.existsByProductNameAndProductBrand(name, brand);
    }

    @Override
    public void deleteProduct(UUID id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<ProductDto> getConvertedProducts(List<ProductEntity> products) {
        return products.stream().map(this::convertToDto).toList();
    }

    @Override
    public ProductDto convertToDto(ProductEntity product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<ImageEntity> images = imageRepository.findByProductProductId(product.getProductId());
        List<ImageDto> imageDtos = images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                .toList();
        productDto.setImages(imageDtos);
        return productDto;
    }

}
