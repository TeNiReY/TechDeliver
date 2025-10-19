package com.techdeliver.entity;

import com.techdeliver.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class OrderEntity {

    @Id
//    @Column(name = "order_id")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID orderId;

    private LocalDate orderDate;
    private BigDecimal orderTotalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItemEntity> orderItems = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

}
