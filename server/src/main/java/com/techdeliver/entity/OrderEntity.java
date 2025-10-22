package com.techdeliver.entity;

import com.techdeliver.enums.OrderStatus;
import com.techdeliver.enums.delivery.DeliveryUrgency;
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
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID orderId;

    private LocalDate orderDate;
    private String deliveryAddress;
    private double distanceInKM;

    private BigDecimal orderTotalPrice;
    private BigDecimal orderItemsTotalPrice;
    private BigDecimal deliveryTotalPrice;


    @Enumerated(EnumType.STRING)
    private DeliveryUrgency  deliveryUrgency;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItemEntity> orderItems = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

    public void calculateOrderTotalPrice() {
        orderTotalPrice = orderItemsTotalPrice.add(deliveryTotalPrice);
    }

}
