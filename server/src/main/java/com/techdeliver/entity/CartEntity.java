package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "carts")
public class CartEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) //TODO: change later
    private UUID cartId;

    private BigDecimal totalPrice;

    @OneToMany(cascade = CascadeType.ALL)
    private Set<CartItemEntity> cartItems = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public void addItem(CartItemEntity cartItem) {
        this.cartItems.add(cartItem);
        cartItem.setCart(this);
        updateTotalPrice();
    }

    public void removeItem(CartItemEntity cartItem) {
        this.cartItems.remove(cartItem);
        cartItem.setCart(null);
        updateTotalPrice();
    }

    private void updateTotalPrice() {
        this.totalPrice = cartItems.stream().map(item -> {
            BigDecimal unitPrice = item.getUnitPrice();
            if(unitPrice == null) {
                return BigDecimal.ZERO;
            }
            return unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
        }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }




}
