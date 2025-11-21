package com.techdeliver.enums.delivery;

public enum DeliveryUrgency {

    STANDARD("Стандартная доставка 3-4 дня", 1.0),
    NEXT_DAY("Ускоренная доставка 2-3 дня", 1.3),
    SAME_DAY("Экстренная доставка 1 день", 1.5);

    private final String description;
    private final double rate;

    DeliveryUrgency(String description, double rate) {
        this.description = description;
        this.rate = rate;
    }

    public String getDescription() {
        return description;
    }

    public double getRate() {
        return rate;
    }
}
