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
    private String deliveryAddress;
    private double distanceInKM;

    private BigDecimal orderTotalPrice;
    private BigDecimal orderItemsTotalPrice;
    private BigDecimal deliveryTotalPrice;
    private BigDecimal installationPrice;

    private String deliveryUrgency;
    private String status;

    private Set<OrderItemDto> orderItems;
}