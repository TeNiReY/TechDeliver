package com.techdeliver.repository;

import com.techdeliver.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<OrderEntity, UUID> {


    List<OrderEntity> findAllByUser_UserId(UUID userUserId);

}
