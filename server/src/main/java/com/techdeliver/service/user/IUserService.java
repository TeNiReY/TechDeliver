package com.techdeliver.service.user;

import com.techdeliver.dto.UserDto;
import com.techdeliver.entity.ProductEntity;
import com.techdeliver.entity.UserEntity;
import com.techdeliver.request.RegisterRequest;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface IUserService {
    UserEntity getUserById(UUID userId);

    List<UserEntity> getAllUsers();

    UserEntity createUserAccount(RegisterRequest request);

    UserEntity updateUsername(UUID userId, String newUsername);

    UserEntity updatePassword(UUID userId, String oldPassword, String newPassword);

    boolean setDeliveryAddress(UUID userId, String address);

    Set<ProductEntity> getUserSavedProducts(UUID userId);

    ProductEntity saveProduct(UUID productId, UUID userId);

    ProductEntity unsaveProduct(UUID productId, UUID userId);

    List<UserDto> getConvertedUsers(List<UserEntity> users);

    UserDto convertToDto(UserEntity cart);
}
