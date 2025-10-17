package com.techdeliver.controller;

import com.techdeliver.dto.ImageDto;
import com.techdeliver.entity.ImageEntity;
import com.techdeliver.exception.ResourceNotFoundException;
import com.techdeliver.service.image.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/images")
public class ImageController { //TODO: improve
    private final IImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<ImageResponse> uploadImages(
            @RequestParam List<MultipartFile> files,
            @RequestParam UUID productId) {
        try {
            if (files == null || files.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ImageResponse(null, "Upload failed! No files provided"));
            }

            List<ImageDto> imageDtos = imageService.saveImages(files, productId);
            return ResponseEntity.ok(new ImageResponse(imageDtos, "Upload success!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ImageResponse(null, "Upload failed! " + e.getMessage()));
        }
    }

    @GetMapping("/download/{imageId}")
    public ResponseEntity<Resource> downloadImage(@PathVariable Long imageId) throws SQLException {
        try {
            ImageEntity image = imageService.getImageById(imageId);
            ByteArrayResource resource = new ByteArrayResource(
                    image.getImage().getBytes(1, (int) image.getImage().length())
            );
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(image.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + image.getFileName() + "\"")
                    .body(resource);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PutMapping("/{imageId}/update")
    public ResponseEntity<ImageResponse> updateImage(
            @PathVariable Long imageId,
            @RequestParam MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ImageResponse(null, "Update failed! No file provided"));
            }

            ImageEntity image = imageService.getImageById(imageId);
            if (image != null) {
                imageService.updateImage(file, imageId);
                return ResponseEntity.ok(new ImageResponse(null, "Update success!"));
            }
            return ResponseEntity.status(404)
                    .body(new ImageResponse(null, "Update failed! Image not found!"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ImageResponse(null, "Update failed! " + e.getMessage()));
        }
    }

    @DeleteMapping("/{imageId}/delete")
    public ResponseEntity<ImageResponse> deleteImage(@PathVariable Long imageId) {
        try {
            ImageEntity image = imageService.getImageById(imageId);
            if (image != null) {
                imageService.deleteImageById(imageId);
                return ResponseEntity.ok(new ImageResponse(null, "Delete success!"));
            }
            return ResponseEntity.status(404)
                    .body(new ImageResponse(null, "Delete failed! Image not found"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ImageResponse(null, "Delete failed! " + e.getMessage()));
        }
    }

    public record ImageResponse(List<ImageDto> imageDto,
                                String message) { }

}