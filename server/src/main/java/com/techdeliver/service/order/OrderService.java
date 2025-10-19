package com.techdeliver.service.order;

import com.techdeliver.dto.OrderDto;
import com.techdeliver.dto.OrderItemDto;
import com.techdeliver.entity.*;
import com.techdeliver.enums.OrderStatus;
import com.techdeliver.exception.EmptyCartException;
import com.techdeliver.repository.OrderRepository;
import com.techdeliver.repository.ProductRepository;
import com.techdeliver.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    private final ICartService cartService;

    private final ModelMapper modelMapper;


    @Override
    public OrderEntity placeOrder(UUID userId) {
        var cart = cartService.getCartByUserId(userId);

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new EmptyCartException("Cart is empty");
        }

        OrderEntity order = createOrder(cart);
        List<OrderItemEntity> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setOrderTotalAmount(calculateTotalAmount(orderItemList));
        OrderEntity savedOrder = orderRepository.save(order);
        cartService.clearCart(userId);

        return savedOrder;
    }

    @Override
    public List<OrderEntity> getUserOrders(UUID userId) {
        return orderRepository.findAllByUser_UserId(userId);
    }

    @Override
    public List<OrderDto> getConvertedOrders(List<OrderEntity> orders) {
        return orders.stream().map(this::convertToDto).toList();
    }

    @Override
    public OrderDto convertToDto(OrderEntity order) { //(update this logic)
//        return modelMapper.map(order, OrderDto.class); //TODO: check how this works

        OrderDto orderDto = modelMapper.map(order, OrderDto.class);

        Set<OrderItemDto> orderItemDtos = order.getOrderItems()
                .stream()
                .map(item -> modelMapper.map(item, OrderItemDto.class))
                .collect(Collectors.toSet());

        orderDto.setOrderItems(orderItemDtos);
        return orderDto;
    }




    private OrderEntity createOrder(CartEntity cart) {
        OrderEntity order = new OrderEntity();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING); //TODO: update status
        order.setOrderDate(LocalDate.now());
        return order;
    }

    private List<OrderItemEntity> createOrderItems(OrderEntity order, CartEntity cart) { //TODO: make as transaction
        return cart.getCartItems().stream().map(cartItem -> {
            ProductEntity product = cartItem.getProduct();
            product.setInventory(product.getInventory() - cartItem.getQuantity());
            productRepository.save(product);
            return new OrderItemEntity(
                    order,
                    product,
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice());
        }).toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItemEntity> orderItemList) {
        return orderItemList
                .stream()
                .map(item -> item.getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

    }

}
