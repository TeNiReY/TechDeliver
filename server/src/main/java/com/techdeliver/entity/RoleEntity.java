package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;
import java.util.HashSet;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "roles")
public class RoleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public RoleEntity(String name) {
        this.name = name;
    }

    @ManyToMany(mappedBy = "roles")
    private Collection<UserEntity> users = new HashSet<>();
}
