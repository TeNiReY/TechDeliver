package com.techdeliver.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;


@Entity
@Getter
@Setter
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    private String email;

    private String username;

    private String password;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private CartEntity cart;

    @ManyToMany(fetch = FetchType.EAGER, cascade =
            {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private Collection<RoleEntity> roles;

//    private Set<String> savedDeliveryAddress = new HashSet<>();
    private String savedDeliveryAddress;

    @ManyToMany
    @JoinTable(
            name = "user_saved_products",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "product_id", referencedColumnName = "productId")
    )
    private Set<ProductEntity> savedProducts = new HashSet<>();


    public UserEntity() {
        cart = new CartEntity();
        cart.setUser(this);
        roles = new HashSet<>();
    }

    public void addRole(RoleEntity role) {
        roles.add(role);
    }

    public void addSavedProduct(ProductEntity product) {
        savedProducts.add(product);
    }

//    public void addNewDeliveryAddress(String address) {
//        savedDeliveryAddress.add(address);
//    }

}
