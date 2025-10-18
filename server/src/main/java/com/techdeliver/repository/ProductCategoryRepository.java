package com.techdeliver.repository;

import com.techdeliver.entity.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, UUID> {


    Optional<ProductCategoryEntity> findByCategoryName(String categoryName);

    boolean existsByCategoryName(String categoryName);

    Optional<ProductCategoryEntity> findByCategoryNameOrCategoryId(String categoryName, UUID categoryId);
}
