package com.techdeliver.util;

import com.techdeliver.entity.CartItemEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Set;

@Service
public class InstallationPriceCalculator {

    private BigDecimal basicInstallationPrice = BigDecimal.valueOf(20); //make possible to change by admin

    public void setBasicInstallationPrice(BigDecimal basicInstallationPrice) {
        this.basicInstallationPrice = basicInstallationPrice;
    }

    public BigDecimal getInstallationPrice() {
        return basicInstallationPrice;
    }

    public BigDecimal calculateInstallationPrice(Set<CartItemEntity> cartItems) {
        return cartItems.stream()
                .map(cartItem -> basicInstallationPrice
                        .multiply(BigDecimal.valueOf(
                                cartItem.getProduct().getProductCategory()
                                        .getInstallationComplexityCoefficient())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}
