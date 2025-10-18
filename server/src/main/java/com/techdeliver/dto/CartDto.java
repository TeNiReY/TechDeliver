package com.techdeliver.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class CartDto {
    private UUID cartId;
    private UUID userId;
    private BigDecimal totalPrice;
    private Set<CartItemDto> cartItems;
}
