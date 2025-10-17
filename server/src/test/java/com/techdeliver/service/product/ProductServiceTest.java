package com.techdeliver.service.product;

import com.techdeliver.entity.ProductEntity;
import com.techdeliver.exception.ResourceNotFoundException;
import com.techdeliver.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    private UUID testId;
    private ProductEntity testProduct;

    @BeforeEach
    void setUp() {
        testId = UUID.randomUUID();
        testProduct = createTestProduct();
    }


    @Test
    void getProductById_shouldReturnProduct_whenExists() {

        when(productRepository.findById(testId)).thenReturn(Optional.of(testProduct));

        ProductEntity result = productService.getApplianceById(testId);

        assertThat(result).isEqualTo(testProduct);
        verify(productRepository).findById(testId);
    }

    @Test
    void getProductById_shouldThrowException_NotFound() {

        when(productRepository.findById(testId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getApplianceById(testId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Appliance with id")
                .hasMessageContaining(testId.toString())
                .hasMessageContaining("not found");

        verify(productRepository).findById(testId);
    }

    ProductEntity createTestProduct() {
        ProductEntity product = new ProductEntity();
        product.setProductId(testId);
        product.setProductName("test");
        product.setPrice(BigDecimal.TEN);
        product.setInventory(10);
        product.setProductBrand("test");
        product.setProductModel("test");
        product.setProductWeight(10);
        product.setProductWidth(10);
        product.setProductHeight(10);
        product.setProductLength(10);
        product.setProductDescription("description");
        return product;
    }


}
