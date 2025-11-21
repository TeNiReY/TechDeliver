package com.techdeliver.enums.delivery;

public enum DeliveryZone {
    ZONE_1("Город (в пределах МКАД)", 0.0, 10.0, 15.0),
    ZONE_2("Пригород", 10.0, 30.0, 25.0),
    ZONE_3("Область", 30.0, 100.0, 40.0),
    ZONE_4("Другие города", 100.0, Double.MAX_VALUE, 60.0);

    private final String description;
    private final double minDistance;
    private final double maxDistance;
    private final double baseFare;

    DeliveryZone(String description, double minDistance, double maxDistance, double baseFare) {
        this.description = description;
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;
        this.baseFare = baseFare;
    }

    public String getDescription() { return description; }
    public double getMinDistance() { return minDistance; }
    public double getMaxDistance() { return maxDistance; }
    public double getBaseFare() { return baseFare; }

    public static DeliveryZone getByDistance(double distance) {
        for (DeliveryZone zone : values()) {
            if (distance >= zone.minDistance && distance < zone.maxDistance) {
                return zone;
            }
        }
        return ZONE_4;
    }

    // Дополнительная плата за каждый км свыше 100 км для зоны 4
    public static final double ZONE_4_EXTRA_RATE = 0.5; // BYN/км

    public double calculateZoneFare(double distance) {
        if (this == ZONE_4 && distance > 100) {
            return baseFare + (distance - 100) * ZONE_4_EXTRA_RATE;
        }
        return baseFare;
    }
}
