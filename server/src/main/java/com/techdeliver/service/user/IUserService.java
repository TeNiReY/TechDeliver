package com.techdeliver.service.user;

import com.techdeliver.dto.UserDto;
import com.techdeliver.entity.UserEntity;
import com.techdeliver.request.RegisterRequest;

import java.util.List;
import java.util.UUID;

public interface IUserService {
    UserEntity getUserById(UUID userId);

    UserEntity createUserAccount(RegisterRequest request);

    UserEntity updateUsername(UUID userId, String newUsername);

    UserEntity updatePassword(UUID userId, String oldPassword, String newPassword);

    boolean setDeliveryAddress(UUID userId, String address);

    List<UserDto> getConvertedProducts(List<UserEntity> users);

    UserDto convertToDto(UserEntity cart);
}
