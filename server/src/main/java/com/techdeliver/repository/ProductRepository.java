package com.techdeliver.repository;

import com.techdeliver.entity.ProductCategoryEntity;
import com.techdeliver.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductEntity, UUID> {


    List<ProductEntity> findAllByProductCategory(ProductCategoryEntity productCategory);

    List<ProductEntity> findAllByProductBrand(String brand);


    List<ProductEntity> findAllByProductModel(String productModel);

    boolean existsByProductNameAndProductBrand(String name, String brand);

    Optional<ProductEntity> findByProductName(String productName);

    List<ProductEntity> findAllByProductCategory_CategoryId(UUID productCategoryCategoryId);
}
