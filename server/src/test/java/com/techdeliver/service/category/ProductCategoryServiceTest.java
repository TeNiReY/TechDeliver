package com.techdeliver.service.category;

import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.repository.ProductCategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
class ProductCategoryServiceTest {

    @Autowired
   private ProductCategoryService service;

   @Autowired
   private ProductCategoryRepository repository;

    @Container
    private static final PostgreSQLContainer<?> postgres =  new PostgreSQLContainer<>(DockerImageName.parse("postgres:latest"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.jpa.generate-ddl", () -> true);
    }

    @Test
    void createCategory_shouldReturnCategory() {

        ProductCategoryEntity result = service.addCategory("Test Category");

        assertThat(result).isNotNull();
        assertThat(result.getCategoryName()).isEqualTo("Test Category");
    }

    @Test
    void getCategoryByName_shouldReturnCategory() {

        ProductCategoryEntity category = new ProductCategoryEntity("Test Category");
        repository.save(category);

        ProductCategoryEntity result = service.getCategoryByName(category.getCategoryName()).get();
        assertThat(result).isNotNull();
        assertThat(result).isEqualTo(category);

    }



}