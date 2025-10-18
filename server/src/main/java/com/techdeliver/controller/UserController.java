package com.techdeliver.controller;

import com.techdeliver.request.RegisterRequest;
import com.techdeliver.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @MutationMapping
    public RegisterResponse registerUserAccount(@Argument RegisterRequest input) {
        userService.createUserAccount(input);
        return new RegisterResponse(true, "User Account Created Successfully");
    }


    public record RegisterResponse(boolean result,
                                   String message) {}

}
