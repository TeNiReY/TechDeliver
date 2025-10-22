package com.techdeliver.enums.delivery;

public enum WeightCategory {
    FREE(0.0, 10.0, 0.0),
    LIGHT(10.0, 50.0, 0.3),
    MEDIUM(50.0, 100.0, 0.5),
    HEAVY(100.0, Double.MAX_VALUE, 0.7);

    private final double minWeight;
    private final double maxWeight;
    private final double ratePerKg;

    WeightCategory(double minWeight, double maxWeight, double ratePerKg) {
        this.minWeight = minWeight;
        this.maxWeight = maxWeight;
        this.ratePerKg = ratePerKg;
    }

    public double getMinWeight() { return minWeight; }
    public double getMaxWeight() { return maxWeight; }
    public double getRatePerKg() { return ratePerKg; }

    public static WeightCategory getByWeight(double weight) {
        for (WeightCategory category : values()) {
            if (weight >= category.minWeight && weight < category.maxWeight) {
                return category;
            }
        }
        return HEAVY;
    }

    public double calculateWeightCharge(double weight) { //TODO: ВАЖНО: вес оплачивается по каждой категории
        if (weight < 10) {
            return 0.0;
        } else if (weight < 50) {
            return (weight - 10) * 0.3;
        } else if (weight < 100) {
            return (40 * 0.3) + (weight - 50) * 0.5;
        } else {
            return (40 * 0.3) + (50 * 0.5) + (weight - 100) * 0.7;
        }
    }

}

