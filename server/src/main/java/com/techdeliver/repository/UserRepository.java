package com.techdeliver.repository;

import com.techdeliver.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {

        UserEntity findByUsername(String username);

        boolean existsByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);
}
