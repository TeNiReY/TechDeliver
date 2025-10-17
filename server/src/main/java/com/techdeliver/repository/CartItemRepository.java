package com.techdeliver.repository;

import com.techdeliver.entity.CartItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItemEntity, UUID> {


    void deleteAllByCart_CartId(UUID cartCartId);
}
