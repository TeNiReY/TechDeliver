package com.techdeliver.dto;

import com.techdeliver.entity.CartItemEntity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class OrderInfoDto {

    private UUID userId;
    private LocalDate orderDate;

    private String deliveryAddress;

    //TODO: поле когда придет заказ.



    private BigDecimal orderTotalPrice;
    private BigDecimal orderItemsTotalPrice;
    private BigDecimal deliveryTotalPrice;
    private String status;
    private Set<CartItemEntity> orderItems;

}
