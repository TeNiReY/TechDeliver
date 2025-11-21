package com.techdeliver.dto;

import com.techdeliver.entity.CartEntity;
import com.techdeliver.entity.RoleEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
public class UserDto {
    private UUID userId;
    private String email;
    private String username;
//    private CartEntity cart;
    private Set<String> roles = new java.util.HashSet<>();
    private String savedDeliveryAddress;

    public void addUserRoles(Collection<RoleEntity> collectionRoles) {
        collectionRoles.forEach(role -> roles.add(role.getName()));
    }
}
