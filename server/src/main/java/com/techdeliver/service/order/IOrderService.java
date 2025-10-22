package com.techdeliver.service.order;

import com.techdeliver.dto.OrderDto;
import com.techdeliver.dto.OrderInfoDto;
import com.techdeliver.entity.OrderEntity;
import com.techdeliver.request.PlaceOrderRequest;

import java.util.List;
import java.util.UUID;

public interface IOrderService {
    OrderInfoDto calculateOrderInfo(PlaceOrderRequest request);

    OrderEntity placeOrder(PlaceOrderRequest request);

    List<OrderEntity> getUserOrders(UUID userId);

    List<OrderDto> getConvertedOrders(List<OrderEntity> orders);

    OrderDto convertToDto(OrderEntity order);
}
