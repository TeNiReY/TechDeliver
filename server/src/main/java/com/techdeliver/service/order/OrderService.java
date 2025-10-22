package com.techdeliver.service.order;

import com.techdeliver.dto.OrderDto;
import com.techdeliver.dto.OrderInfoDto;
import com.techdeliver.dto.OrderItemDto;
import com.techdeliver.entity.*;
import com.techdeliver.enums.OrderStatus;
import com.techdeliver.enums.delivery.DeliveryUrgency;
import com.techdeliver.exception.EmptyCartException;
import com.techdeliver.repository.OrderRepository;
import com.techdeliver.repository.ProductRepository;
import com.techdeliver.request.PlaceOrderRequest;
import com.techdeliver.service.cart.ICartService;
import com.techdeliver.util.DeliveryPriceCalculator;
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
    public OrderInfoDto calculateOrderInfo(PlaceOrderRequest request) {
        var cart = cartService.getCartByUserId(request.getUserId());

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new EmptyCartException("Cart is empty");
        }

        OrderInfoDto orderInfo = new OrderInfoDto();
        orderInfo.setUserId(request.getUserId());
        orderInfo.setOrderDate(LocalDate.now());
        orderInfo.setDeliveryAddress(request.getDeliveryAddress());
        //TODO: set date when is order come
        orderInfo.setStatus(request.getDeliveryUrgency());

        double deliveryTotalAmount = DeliveryPriceCalculator
                .calculateTotalDeliveryPrice(
                        cart.getCartItems(),
                        request.getDistanceInKM(),
                        DeliveryUrgency.valueOf(request.getDeliveryUrgency()));

        orderInfo.setDeliveryTotalPrice(BigDecimal.valueOf(deliveryTotalAmount));
        orderInfo.setOrderItemsTotalPrice(calculateOrderItemsTotalPrice(cart.getCartItems()));
        orderInfo.setOrderTotalPrice(calculateTotalAmount(orderInfo));
        orderInfo.setOrderItems(cart.getCartItems());

        return orderInfo;
    }


    @Override
    public OrderEntity placeOrder(PlaceOrderRequest request) {
        var cart = cartService.getCartByUserId(request.getUserId());

        if (cart == null || cart.getCartItems().isEmpty()) {
            throw new EmptyCartException("Cart is empty");
        } //TODO: here check is cart was changed


        OrderEntity order = createOrder(cart, request);
        List<OrderItemEntity> orderItemList = createOrderItems(order, cart);
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setOrderItemsTotalPrice(calculateOrderItemsTotalAmount(orderItemList));
        order.calculateOrderTotalPrice();

        OrderEntity savedOrder = orderRepository.save(order);
        cartService.clearCart(order.getUser().getUserId());

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
    public OrderDto convertToDto(OrderEntity order) {
        OrderDto orderDto = modelMapper.map(order, OrderDto.class);
        Set<OrderItemDto> orderItemDtos = order.getOrderItems()
                .stream()
                .map(item -> modelMapper.map(item, OrderItemDto.class))
                .collect(Collectors.toSet());
        orderDto.setOrderItems(orderItemDtos);
        return orderDto;
    }




    private OrderEntity createOrder(CartEntity cart, PlaceOrderRequest request) { //TODO: change here
        OrderEntity order = new OrderEntity();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING); //TODO: update status
        order.setOrderDate(LocalDate.now());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setDeliveryUrgency(DeliveryUrgency.valueOf(request.getDeliveryUrgency()));

        double deliveryTotalPrice = DeliveryPriceCalculator
                .calculateTotalDeliveryPrice(
                        cart.getCartItems(),
                        request.getDistanceInKM(),
                        DeliveryUrgency.valueOf(request.getDeliveryUrgency()));
        order.setDeliveryTotalPrice(BigDecimal.valueOf(deliveryTotalPrice));

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

    private BigDecimal calculateTotalAmount(OrderInfoDto orderInfo) {
        return orderInfo.getOrderItemsTotalPrice().add(orderInfo.getDeliveryTotalPrice());
    }

    private BigDecimal calculateOrderItemsTotalPrice(Set<CartItemEntity> items) {
        return items
                .stream()
                .map(item -> item.getProduct().getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateOrderItemsTotalAmount(List<OrderItemEntity> orderItemList) {
        return orderItemList
                .stream()
                .map(item -> item.getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
