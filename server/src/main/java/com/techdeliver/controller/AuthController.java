package com.techdeliver.controller;

import com.techdeliver.request.LoginRequest;
import com.techdeliver.security.jwt.JwtUtils;
import com.techdeliver.security.user.ShopUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    @MutationMapping
    public AuthResponse login(@Argument LoginRequest input)  {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(input.getEmail(), input.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtils.generateTokenForUser(authentication);
            ShopUserDetails userDetails = (ShopUserDetails) authentication.getPrincipal();

            return new AuthResponse(jwt, userDetails.getId(), "Login Successful");
    }

    public record AuthResponse(String token,
                               UUID userId,
                               String message) {}

}