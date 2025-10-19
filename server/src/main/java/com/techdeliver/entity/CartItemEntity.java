package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "cart_items")
public class CartItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID cartItemId;

    private int quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

    @ManyToOne
    private ProductEntity product;

    @ManyToOne
    private CartEntity cart;

    public void setTotalPrice() {
        this.totalPrice = this.unitPrice.multiply(this.product.getPrice());
    }

    public void increaseQuantity(int quantity) {
        this.quantity += quantity;
    }

    public void reduceQuantity(int quantity) {
        this.quantity -= quantity;
    }
}
