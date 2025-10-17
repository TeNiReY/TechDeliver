package com.techdeliver.dto;

import java.math.BigDecimal;
import java.util.Set;
import java.util.UUID;

public class CartDto {
    private UUID cartId;
    private UUID userId;
    private BigDecimal totalPrice;
    private Set<CartItemDto> cartItems;
}
