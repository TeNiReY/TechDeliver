package com.techdeliver.service.image;

import com.techdeliver.dto.ImageDto;
import com.techdeliver.entity.ImageEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface IImageService {


    ImageEntity getImageById(Long id);

    void deleteImageById(Long id);

    List<ImageDto> saveImages(List<MultipartFile> files, UUID productId);

    void updateImage(MultipartFile file, Long imageId);
}
