package com.techdeliver.service.cart;

import com.techdeliver.dto.CartDto;
import com.techdeliver.dto.CartItemDto;
import com.techdeliver.dto.ProductDto;
import com.techdeliver.entity.CartEntity;
import com.techdeliver.entity.CartItemEntity;
import com.techdeliver.exception.ResourceNotFoundException;
import com.techdeliver.repository.CartItemRepository;
import com.techdeliver.repository.CartRepository;
import com.techdeliver.service.product.IProductService;
import com.techdeliver.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final IProductService productService;
    private final IUserService userService;

    private final ModelMapper modelMapper;


    public CartEntity getCartById(UUID id) {
        return cartRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Cart with id: " + id + " not found!"));
    }

    @Override
    public CartEntity getCartByUserId(UUID userId) {
        return cartRepository.findByUser_UserId(userId).orElseGet(() -> {
            CartEntity cart = new CartEntity();
            cart.setUser(userService.getUserById(userId));
            return cartRepository.save(cart);
        });
    }

    @Override
    public void clearCart(UUID userId) { //TODO: make for user
        CartEntity cart = getCartById(userId);
        cartItemRepository.deleteAllByCart_CartId(cart.getCartId());
        cart.getCartItems().clear();
        cartRepository.deleteById(cart.getCartId());
    }

    @Override
    public void addItemToCart(UUID userId, UUID productId, int quantity) {

        var cart = getCartById(userId); //TODO: change
        var product = productService.getProductById(productId);

        var cartItem = cart.getCartItems()
                .stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst().orElse(new CartItemEntity());

        if (cartItem.getCartItemId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setQuantity(quantity);
        } else {
            cartItem.increaseQuantity(quantity);
        }

        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }

    @Override
    public void removeItemFromCart(UUID userId, UUID productId) {
        var cart = getCartById(userId);
        var itemToRemove = getCartItem(userId, productId);
        cart.removeItem(itemToRemove);
        cartItemRepository.delete(itemToRemove); //TODO: проверить надо ли это удаление?
        cartRepository.save(cart);
    }

    @Override
    public void updateItemQuantity(UUID userId, UUID productId, int quantity) {
        var cart = getCartById(userId);

        cart.getCartItems()
                .stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setUnitPrice(item.getProduct().getPrice());
                    item.setTotalPrice();
                });
        BigDecimal totalPrice = cart.getCartItems()
                .stream()
                .map(CartItemEntity::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalPrice(totalPrice);// TODO: проверить обновляется ли то что я добавил (именно cartItem)
        cartRepository.save(cart);
    }

    @Override
    public CartItemEntity getCartItem(UUID cartId, UUID productId) {
        var cart =  getCartById(cartId);
        return cart.getCartItems()
                .stream()
                .filter(item -> item.getProduct().getProductId().equals(productId))
                .findFirst().orElseThrow(() ->
                        new ResourceNotFoundException("Product with id: " + productId +
                                " not found in cart with id: " + cartId + " !"));
    }

    @Override
    public List<CartDto> getConvertedProducts(List<CartEntity> cart) {
        return cart.stream().map(this::convertToDto).toList();
    }

    @Override
    public CartDto convertToDto(CartEntity cart) {
        CartDto cartDto = modelMapper.map(cart, CartDto.class);

        Set<CartItemDto> cartItemDtos = cart.getCartItems().stream()
                .map(item -> {
                    CartItemDto itemDto = modelMapper.map(item, CartItemDto.class);
                    itemDto.setProduct(modelMapper.map(item.getProduct(), ProductDto.class));
                    return itemDto;
                })
                .collect(Collectors.toSet());

        cartDto.setCartItems(cartItemDtos);
        return cartDto;
    }


}
