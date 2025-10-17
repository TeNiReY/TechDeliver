package com.techdeliver.service.cart;

import com.techdeliver.entity.CartEntity;
import com.techdeliver.entity.CartItemEntity;

import java.util.List;
import java.util.UUID;

public interface ICartService {


    void clearCart(UUID userId);

    void addItemToCart(UUID userId, UUID productId, int quantity);

    void removeItemFromCart(UUID userId, UUID productId);

    void updateItemQuantity(UUID userId, UUID productId, int quantity);

    CartItemEntity getCartItem(UUID cartId, UUID productId);

    CartEntity getCartByUserId(UUID userId);

}
