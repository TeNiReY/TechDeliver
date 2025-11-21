package com.techdeliver.service.order;

import com.techdeliver.dto.OrderDto;
import com.techdeliver.entity.OrderEntity;

import java.util.List;
import java.util.UUID;

public interface IOrderService {
    OrderEntity placeOrder(UUID userId); //TODO: check - cart shouldn't be null

    List<OrderEntity> getUserOrders(UUID userId);

    List<OrderDto> getConvertedOrders(List<OrderEntity> orders);

    OrderDto convertToDto(OrderEntity order);
}
