package com.techdeliver.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class OrderItemDto {
    private UUID productId;
    private String productName;
    private String productBrand;
    private int quantity;
    private BigDecimal price;
}
