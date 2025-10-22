package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "categories")
public class ProductCategoryEntity { //TODO: add base delivery price + base installation price

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID categoryId;

    private String categoryName;

    private String categoryDescription;

    @OneToMany(mappedBy = "productCategory")
    private List<ProductEntity> products;

    public ProductCategoryEntity(String categoryName) {
        this.categoryName = categoryName;
    }

    public ProductCategoryEntity(String categoryName, String categoryDescription) {
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        products =  new ArrayList<>();
    }

}
