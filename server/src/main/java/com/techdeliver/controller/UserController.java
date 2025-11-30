package com.techdeliver.controller;

import com.techdeliver.dto.ProductDto;
import com.techdeliver.dto.UserDto;
import com.techdeliver.entity.ProductEntity;
import com.techdeliver.request.RegisterRequest;
import com.techdeliver.security.permission.RequireRole;
import com.techdeliver.service.product.IProductService;
import com.techdeliver.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final IProductService productService;

    @MutationMapping
    public RegisterResponse registerUserAccount(@Argument RegisterRequest input) {
        userService.createUserAccount(input);
        return new RegisterResponse(true, "User Account Created Successfully");
    }

    @QueryMapping
    @RequireRole({"ADMIN", "USER"})
    public UserDto getUserProfileInfo(@Argument UUID userId) {
        var user =  userService.getUserById(userId);
        return userService.convertToDto(user);
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public UserDto updateUsername(@Argument UUID userId, @Argument String newUsername) {
        var updatedUser = userService.updateUsername(userId, newUsername);
        return userService.convertToDto(updatedUser);
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public UserDto updateUserPassword(@Argument UUID userId,
                                  @Argument String oldPass,
                                  @Argument String newPass
                                  ) {
        var updatedUser = userService.updatePassword(userId, oldPass, newPass);
        return userService.convertToDto(updatedUser);
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public boolean setDeliveryAddress(@Argument UUID userId, @Argument String address) {
        return userService.setDeliveryAddress(userId, address);
    }

    @QueryMapping
    @RequireRole({"ADMIN", "USER"})
    public String getUserDeliveryAddress(@Argument UUID userId) {
        var user = userService.getUserById(userId);
        return user.getSavedDeliveryAddress();
    }

    @QueryMapping
    @RequireRole({"ADMIN", "USER"})
    public Set<ProductDto> getUserSavedProducts(@Argument UUID userId) {
        Set<ProductEntity> savedProducts = userService.getUserSavedProducts(userId);
        return savedProducts.stream()
                .map(productService::convertToDto)
                .collect(Collectors.toSet());
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public ProductDto saveProduct(@Argument UUID productId, @Argument UUID userId) {
        var savedProduct = userService.saveProduct(productId, userId);
        return productService.convertToDto(savedProduct);
    }

    @QueryMapping
    @RequireRole({"ADMIN", "USER"})
    public List<String> getSavedProductsIds(@Argument UUID userId) {
        var savedProducts = userService.getUserSavedProducts(userId);
        return savedProducts.stream()
                .map(ProductEntity::getProductId)
                .map(UUID::toString)
                .collect(Collectors.toList());
    }

    @MutationMapping
    @RequireRole({"ADMIN", "USER"})
    public boolean unsaveProduct(@Argument UUID productId, @Argument UUID userId) {
        var unsavedProduct = userService.unsaveProduct(productId, userId);
        return true;
    }

    @MutationMapping
    @RequireRole("ADMIN")
    public UserDto blockUser(@Argument UUID userId) {
        var blockedUser = userService.blockUser(userId);
        return userService.convertToDto(blockedUser);
    }

    @MutationMapping
    @RequireRole("ADMIN")
    public UserDto unblockUser(@Argument UUID userId) {
        var blockedUser = userService.unblockUser(userId);
        return userService.convertToDto(blockedUser);
    }

    @QueryMapping
    public List<UserDto> getAllUsers() {
        return userService.getConvertedUsers(userService.getAllUsers());
    }


    public record RegisterResponse(boolean result,
                                   String message) {}

}
