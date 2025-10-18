package com.techdeliver.controller;

import com.techdeliver.dto.CartDto;
import com.techdeliver.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @QueryMapping
    public CartDto getCart(@Argument UUID userId) {
        var cart = cartService.getCartByUserId(userId);
        return cartService.convertToDto(cart);
    }

}
