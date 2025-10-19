package com.techdeliver.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class OrderDto {
    private UUID id;
    private UUID userId;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
    private String status;
    private Set<OrderItemDto> orderItems;
}