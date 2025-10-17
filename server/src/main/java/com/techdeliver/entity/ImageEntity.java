package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Blob;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "images")
public class ImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fileName;
    private String fileType;

    @Lob // показывает что хранятся большие обьемы данных
    private Blob image;
    private String downloadUrl;

    @ManyToOne
    @JoinColumn(name = "product_id") // внешний ключ на таблицу product
    private ProductEntity product;
}
