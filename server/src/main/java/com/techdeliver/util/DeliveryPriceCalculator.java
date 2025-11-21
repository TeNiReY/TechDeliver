package com.techdeliver.util;

import com.techdeliver.entity.CartItemEntity;
import com.techdeliver.enums.delivery.DeliveryUrgency;
import com.techdeliver.enums.delivery.DeliveryZone;
import com.techdeliver.enums.delivery.VolumeCategory;
import com.techdeliver.enums.delivery.WeightCategory;

import java.util.Set;


public class DeliveryPriceCalculator {


    // Стоимость по весу:
    // < 10 кг -> беслпатно
    // 10-50 кг -> 0.3 BYN/кг
    // 50-100 кг -> 0.5 BYN/kg
    // > 100 kg -> 07. BYN/kg

    // ДОПОЛНИТЕЛЬНО ПЛАТА ЗА ГАБАРИТЫ (считается по обьему)

    // мелкая техника до 0.05м х1.0
    // Средняя техника 0,05-0,3 м³ (×1,2)
    // Крупная техника 0,3-0,7 м³ (×1,5)
    // Крупногабаритная техника более 0,7 м³ (×2,0)


    // ПЛАТА ЗА РАССТОЯНИЕ
//    Зона 1 (город в пределах МКАД): 15 BYN базовый тариф
//
//    Зона 2 (пригород до 30 км): 25 BYN базовый тариф
//
//    Зона 3 (область 30-100 км): 40 BYN базовый тариф
//
//    Зона 4 (другие города): 60 BYN + 0,5 BYN за каждый км свыше 100 км

    //ПЛАТА ЗА СРОЧНОСТЬ

    //STANDARD("Стандартная доставка 3-4 дня", x1.0),
    //    NEXT_DAY("Ускоренная доставка 2-3 дня", x1.3),
    //    SAME_DAY("Экстренная доставка 1 день", x1.5);

    //ИТОГОВАЯ ФОРМУЛА
    // Итоговая цена = ((Базовый тариф зоны + Плата за вес) × Коэффициент объема) × Коэффициент срочности

    public static double calculateTotalDeliveryPrice(Set<CartItemEntity> orderItems,
                                              double distanceInKM,
                                              DeliveryUrgency deliveryUrgency
    ) {
        double deliveryTotalPrice = 0;
        double totalWeightCharge = 0;
        double maxVolumeCoefficient = 1.0;

        for (var item : orderItems) {

            double volume = VolumeCategory.calculateVolume(
                    item.getProduct().getProductLength(),
                    item.getProduct().getProductWidth(),
                    item.getProduct().getProductHeight());

            VolumeCategory volumeCategory = VolumeCategory.getByVolume(volume);

            maxVolumeCoefficient = Math.max(maxVolumeCoefficient, volumeCategory.getCoefficient());
            WeightCategory weightCategory = WeightCategory.getByWeight(item.getProduct().getProductWeight());

            double itemWeightCharge = weightCategory.calculateWeightCharge(item.getProduct().getProductWeight());

            totalWeightCharge += itemWeightCharge;
        }

        DeliveryZone deliveryZone = DeliveryZone.getByDistance(distanceInKM);

        // Итоговая цена = ((Базовый тариф зоны + Плата за вес) × Коэффициент объема) × Коэффициент срочности
        deliveryTotalPrice =
                ((deliveryZone.calculateZoneFare(distanceInKM)
                        + totalWeightCharge)
                        * maxVolumeCoefficient)
                        * deliveryUrgency.getRate();

            return deliveryTotalPrice;
    }






}
