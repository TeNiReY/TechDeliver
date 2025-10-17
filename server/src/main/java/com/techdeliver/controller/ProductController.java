package com.techdeliver.controller;


import com.techdeliver.dto.ProductDto;
import com.techdeliver.request.AddProductRequest;
import com.techdeliver.request.UpdateProductRequest;
import com.techdeliver.service.product.IProductService;
import com.techdeliver.util.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    @MutationMapping
    public ProductResponse addProduct(@Argument AddProductRequest input) {

        var createdProduct = productService.addProduct(input);

        return new ProductResponse(
                ProductMapper.mapToDto(createdProduct),
                "Новый продукт был успешно добавлен!");
    }

    @MutationMapping
    public ProductResponse updateProduct(@Argument UUID productId, @Argument UpdateProductRequest input) {

        var updatedProduct = productService.updateProduct(productId, input);

        return new ProductResponse(
                ProductMapper.mapToDto(updatedProduct),
                "Продукт был успешно обновлён!");
    }

    @MutationMapping
    public boolean deleteProduct(@Argument UUID productId) {
        productService.deleteProduct(productId);
        return true;
    }

    public record ProductResponse(ProductDto productDto,
                                        String message) {}


}
