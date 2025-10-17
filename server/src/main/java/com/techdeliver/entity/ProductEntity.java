package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
public class ProductEntity { //TODO: add image

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) //TODO: change later
    private UUID productId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "category_id")
    private ProductCategoryEntity productCategory;

    private String productName;

    private BigDecimal price;

    private int inventory;

    private String productBrand;

    private String productModel;

    private float productWeight;

    private float productWidth;

    private float productLength;

    private float productHeight;

    private String productDescription;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageEntity> images;

    public ProductEntity(ProductCategoryEntity applianceCategory,
                         String applianceName,
                         BigDecimal price,
                         int inventory,
                         String applianceBrand,
                         String applianceModel,
                         float applianceWeight,
                         float applianceWidth,
                         float applianceLength,
                         float applianceHeight,
                         String applianceDescription
    ) {
        this.productCategory = applianceCategory;
        this.productName = applianceName;
        this.price = price;
        this.inventory = inventory;
        this.productBrand = applianceBrand;
        this.productModel = applianceModel;
        this.productWeight = applianceWeight;
        this.productWidth = applianceWidth;
        this.productLength = applianceLength;
        this.productHeight = applianceHeight;
        this.productDescription = applianceDescription;
    }

    public void increaseQuantity(int quantity) {
        this.inventory += quantity;
    }
    
    public void reduceQuantity(int quantity) {
        this.inventory -= quantity;
    }
    
    

}
