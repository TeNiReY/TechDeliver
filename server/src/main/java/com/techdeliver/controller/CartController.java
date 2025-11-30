package com.techdeliver.controller;

import com.techdeliver.dto.CartDto;
import com.techdeliver.security.permission.RequireRole;
import com.techdeliver.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @QueryMapping
    @RequireRole({"ADMIN", "USER"})
    public CartDto getCart(@Argument UUID userId) {
        var cart = cartService.getCartByUserId(userId);
        return cartService.convertToDto(cart);
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public CartResponse addItemToCart(@Argument UUID userId,
                                      @Argument UUID productId,
                                      @Argument int quantity
    ) {
        cartService.addItemToCart(userId, productId, quantity);
        return new CartResponse(true, "Item added successfully");
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public CartResponse removeItemFromCart(@Argument UUID userId,
                                      @Argument UUID productId
    ) {
        cartService.removeItemFromCart(userId, productId);
        return new CartResponse(true, "Item removed successfully");
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public CartResponse updateItemQuantity(@Argument UUID userId,
                                      @Argument UUID productId,
                                      @Argument int newQuantity
    ) {
        cartService.updateItemQuantity(userId, productId, newQuantity);
        return new CartResponse(true, "Item quantity updated successfully");
    }

        public record CartResponse(boolean result,
                               String message) {}

}
