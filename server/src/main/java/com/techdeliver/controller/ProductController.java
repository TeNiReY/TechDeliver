package com.techdeliver.controller;


import com.techdeliver.dto.ProductDto;
import com.techdeliver.request.AddProductRequest;
import com.techdeliver.request.UpdateProductRequest;
import com.techdeliver.service.product.IProductService;
import jakarta.servlet.ServletConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Slf4j
@Controller
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;
    private final ServletConfig servletConfig;

    @QueryMapping
    public ProductDto getProductById(@Argument UUID productId) {
        var product =  productService.getProductById(productId);
        return productService.convertToDto(product);
    }

    @MutationMapping
    public ProductResponse addProduct(@Argument AddProductRequest input) {

        var createdProduct = productService.addProduct(input);

        log.info("Created product {}", createdProduct.toString());

        return new ProductResponse(
                productService.convertToDto(createdProduct),
                "Новый продукт был успешно добавлен!");
    }

    @MutationMapping
    public ProductResponse updateProduct(@Argument UUID productId, @Argument UpdateProductRequest input) {

        var updatedProduct = productService.updateProduct(productId, input);

        return new ProductResponse(
                productService.convertToDto(updatedProduct),
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
