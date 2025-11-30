package com.techdeliver.controller;

import com.techdeliver.dto.OrderDto;
import com.techdeliver.dto.OrderInfoDto;
import com.techdeliver.entity.OrderEntity;
import com.techdeliver.request.PlaceOrderRequest;
import com.techdeliver.security.permission.RequireRole;
import com.techdeliver.service.order.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService orderService;

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public OrderInfoDto calculateOrderPreview(@Argument PlaceOrderRequest input) {
        return orderService.calculateOrderInfo(input);
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public OrderDto placeOrder(@Argument PlaceOrderRequest input) {
        OrderEntity order = orderService.placeOrder(input);
        return orderService.convertToDto(order); //TODO: change convert logic here
    }

    @QueryMapping
    @RequireRole({"ADMIN", "USER"})
    public List<OrderDto> getUserOrders(@Argument UUID userId) {
        List<OrderEntity> orders = orderService.getUserOrders(userId);
        return orderService.getConvertedOrders(orders);
    }

    @QueryMapping
    @RequireRole("ADMIN")
    public List<OrderDto> getAllOrders() {
        return orderService.getConvertedOrders(orderService.getAllOrders());
    }

    @MutationMapping
    @RequireRole("ADMIN")
    public OrderDto updateOrderStatus(@Argument UUID orderId, @Argument String status) {
        var updatedOrder = orderService.updateOrderStatus(orderId, status);
        return orderService.convertToDto(updatedOrder);
    }


}
