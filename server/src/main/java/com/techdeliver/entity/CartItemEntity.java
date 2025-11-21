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
public class CartItemEntity { //TODO: зачем нам unitPrice? и totalPrice неправильно считается

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
        this.totalPrice = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity)); // TODO: check this
    }

    public void increaseQuantity(int quantity) {
        this.quantity += quantity;
    }

    public void reduceQuantity(int quantity) {
        this.quantity -= quantity;
    }
}
