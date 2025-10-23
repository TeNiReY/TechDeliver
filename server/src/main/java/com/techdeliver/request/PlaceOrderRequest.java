package com.techdeliver.request;

import com.techdeliver.enums.delivery.DeliveryUrgency;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class PlaceOrderRequest {
    private UUID userId;
    private String deliveryAddress; //TODO: вот по этому параметру надо высчитывать расстояние
    private String deliveryUrgency;
    private double distanceInKM; //TODO: временно (потом реализовать автоматический расчет)
    private boolean needInstallation;
}
