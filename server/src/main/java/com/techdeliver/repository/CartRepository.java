package com.techdeliver.repository;

import com.techdeliver.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CartRepository extends JpaRepository<CartEntity, UUID> {


    Optional<CartEntity> findByUser_UserId(UUID userUserId);
}
