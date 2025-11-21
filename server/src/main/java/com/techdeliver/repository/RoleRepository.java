package com.techdeliver.repository;


import com.techdeliver.entity.ProductEntity;
import com.techdeliver.entity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

    RoleEntity findByName(String name);

}
