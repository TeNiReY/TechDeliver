package com.techdeliver.repository;

import com.techdeliver.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {


    List<ImageEntity> findByProductProductId(UUID productProductId);
}
