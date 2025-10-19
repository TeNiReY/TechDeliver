package com.techdeliver.controller;

import com.techdeliver.dto.UserDto;
import com.techdeliver.request.RegisterRequest;
import com.techdeliver.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @MutationMapping
    public RegisterResponse registerUserAccount(@Argument RegisterRequest input) {
        userService.createUserAccount(input);
        return new RegisterResponse(true, "User Account Created Successfully");
    }

    @QueryMapping
    public UserDto getUserProfileInfo(@Argument UUID userId) {
        var user =  userService.getUserById(userId);
        return userService.convertToDto(user);
    }

    @MutationMapping
    public UserDto updateUsername(@Argument UUID userId, @Argument String newUsername) {
        var updatedUser = userService.updateUsername(userId, newUsername);
        return userService.convertToDto(updatedUser);
    }

    @MutationMapping
    public UserDto updateUserPassword(@Argument UUID userId,
                                  @Argument String oldPass,
                                  @Argument String newPass
                                  ) {
        var updatedUser = userService.updatePassword(userId, oldPass, newPass);
        return userService.convertToDto(updatedUser);
    }


    public record RegisterResponse(boolean result,
                                   String message) {}

}
