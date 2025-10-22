package com.techdeliver.enums.delivery;

public enum VolumeCategory {
    SMALL(0.0, 0.05, 1.0),      // до 0.05 м³
    MEDIUM(0.05, 0.3, 1.2),     // 0.05-0.3 м³
    LARGE(0.3, 0.7, 1.5),       // 0.3-0.7 м³
    EXTRA_LARGE(0.7, Double.MAX_VALUE, 2.0);  // более 0.7 м³

    private final double minVolume;
    private final double maxVolume;
    private final double coefficient;

    VolumeCategory(double minVolume, double maxVolume, double coefficient) {
        this.minVolume = minVolume;
        this.maxVolume = maxVolume;
        this.coefficient = coefficient;
    }

    public double getMinVolume() { return minVolume; }
    public double getMaxVolume() { return maxVolume; }
    public double getCoefficient() { return coefficient; }

    public static VolumeCategory getByVolume(double volume) {
        for (VolumeCategory category : values()) {
            if (volume >= category.minVolume && volume < category.maxVolume) {
                return category;
            }
        }
        return EXTRA_LARGE;
    }

    // Вспомогательный метод для расчета объема
    public static double calculateVolume(double length, double width, double height) {
        return (length * width * height) / 1_000_000.0; // переводим см³ в м³
    }
}
