import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { GET_CART_QUERY, REMOVE_ITEM_FROM_CART, UPDATE_ITEM_QUANTITY, CALCULATE_ORDER_PREVIEW, PLACE_ORDER } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';

const CartView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderStep, setOrderStep] = useState('cart'); // 'cart', 'preview', 'success'
  const [orderPreview, setOrderPreview] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    deliveryAddress: '',
    deliveryUrgency: 'STANDARD',
    distanceInKM: 0
  });
  
  const { data, loading, error, refetch } = useQuery(GET_CART_QUERY, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    onError: (error) => {
      console.error('Cart query error:', error);
    }
  });

  const [removeItemFromCart] = useMutation(REMOVE_ITEM_FROM_CART, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error removing item from cart:', error);
    }
  });

  const [updateItemQuantity] = useMutation(UPDATE_ITEM_QUANTITY, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => {
      console.error('Error updating item quantity:', error);
    }
  });

  const [calculateOrderPreview] = useMutation(CALCULATE_ORDER_PREVIEW, {
    onCompleted: (data) => {
      setOrderPreview(data.calculateOrderPreview);
      setOrderStep('preview');
      setIsPlacingOrder(false);
    },
    onError: (error) => {
      console.error('Error calculating order preview:', error);
      alert('Ошибка при расчёте заказа: ' + error.message);
      setIsPlacingOrder(false);
    }
  });

  const [placeOrder] = useMutation(PLACE_ORDER, {
    onCompleted: () => {
      setIsPlacingOrder(false);
      setOrderStep('success');
      refetch();
    },
    onError: (error) => {
      console.error('Error placing order:', error);
      alert('Ошибка при оформлении заказа: ' + error.message);
      setIsPlacingOrder(false);
    }
  });

  const handleRemoveItem = async (productId) => {
    try {
      await removeItemFromCart({
        variables: {
          userId: user.userId,
          productId: productId
        }
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    try {
      await updateItemQuantity({
        variables: {
          userId: user.userId,
          productId: productId,
          newQuantity: newQuantity
        }
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCalculatePreview = async () => {
    if (!user?.userId) {
      alert('Необходимо войти в систему для оформления заказа');
      return;
    }

    if (!deliveryData.deliveryAddress.trim()) {
      alert('Пожалуйста, укажите адрес доставки');
      return;
    }

    if (deliveryData.distanceInKM <= 0) {
      alert('Пожалуйста, укажите расстояние доставки');
      return;
    }

    setIsPlacingOrder(true);
    try {
      await calculateOrderPreview({
        variables: {
          input: {
            userId: user.userId,
            deliveryAddress: deliveryData.deliveryAddress,
            deliveryUrgency: deliveryData.deliveryUrgency,
            distanceInKM: parseFloat(deliveryData.distanceInKM)
          }
        }
      });
    } catch (error) {
      console.error('Error calculating preview:', error);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user?.userId) {
      alert('Необходимо войти в систему для оформления заказа');
      return;
    }

    setIsPlacingOrder(true);
    try {
      await placeOrder({
        variables: {
          input: {
            userId: user.userId,
            deliveryAddress: deliveryData.deliveryAddress,
            deliveryUrgency: deliveryData.deliveryUrgency,
            distanceInKM: parseFloat(deliveryData.distanceInKM)
          }
        }
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  console.log('CartView - user:', user);
  console.log('CartView - userId:', user?.userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Загрузка корзины...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Ошибка загрузки корзины: {error.message}
      </div>
    );
  }

  const cart = data?.getCart;

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
        <p className="text-gray-500">Добавьте товары в корзину, чтобы увидеть их здесь</p>
      </div>
    );
  }

  // Success View
  if (orderStep === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Заказ успешно оформлен!</h2>
          <p className="text-green-700 mb-6">Спасибо за покупку. Ваш заказ принят в обработку.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/account?tab=orders')}
              className="px-6 py-3 bg-[#950740] hover:bg-[#7a052f] text-white rounded-lg font-medium transition-colors"
            >
              Посмотреть заказы
            </button>
            <button
              onClick={() => {
                setOrderStep('cart');
                setOrderPreview(null);
                setShowDeliveryForm(false);
                setDeliveryData({
                  deliveryAddress: '',
                  deliveryUrgency: 'STANDARD',
                  distanceInKM: 0
                });
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Вернуться в корзину
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview View
  if (orderStep === 'preview' && orderPreview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-2 text-gray-600">
          <button
            onClick={() => setOrderStep('cart')}
            className="flex items-center hover:text-[#950740] transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к корзине
          </button>
        </div>

        <div className="bg-white border-2 border-[#950740] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Предварительный расчёт заказа</h2>

          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Информация о доставке</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Адрес доставки:</span>
                <span>{orderPreview.deliveryAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Срочность:</span>
                <span>
                  {deliveryData.deliveryUrgency === 'STANDARD' && 'Стандартная доставка 3-4 дня'}
                  {deliveryData.deliveryUrgency === 'NEXT_DAY' && 'Ускоренная доставка 2-3 дня'}
                  {deliveryData.deliveryUrgency === 'SAME_DAY' && 'Экстренная доставка 1 день'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Расстояние:</span>
                <span>{deliveryData.distanceInKM} км</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Товары в заказе</h3>
            <div className="space-y-3">
              {orderPreview.orderItems.map((item) => (
                <div key={item.cartItemId} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0].downloadUrl}
                      alt={item.product.productName}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product?.productName}</h4>
                    <p className="text-sm text-gray-600">
                      {item.product?.productBrand} {item.product?.productModel}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.unitPrice?.toFixed(2)} ₽ × {item.quantity} шт.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">{item.totalPrice?.toFixed(2)} ₽</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Итоговая стоимость</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Стоимость товаров:</span>
                <span className="font-semibold">{orderPreview.orderItemsTotalPrice?.toFixed(2)} ₽</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Стоимость доставки:</span>
                <span className="font-semibold">{orderPreview.deliveryTotalPrice?.toFixed(2)} ₽</span>
              </div>
              <div className="border-t-2 border-purple-300 pt-3 flex justify-between text-xl font-bold text-[#950740]">
                <span>Итого к оплате:</span>
                <span>{orderPreview.orderTotalPrice?.toFixed(2)} ₽</span>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setOrderStep('cart')}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            >
              Изменить заказ
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={isPlacingOrder}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                isPlacingOrder
                  ? 'bg-[#950740] bg-opacity-70 text-white cursor-wait'
                  : 'bg-[#950740] hover:bg-[#7a052f] text-white'
              }`}
            >
              {isPlacingOrder ? 'Оформляем заказ...' : 'Подтвердить и оформить заказ'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart View with Delivery Form
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Корзина</h2>
        <div className="text-lg font-medium">
          Сумма товаров: <span className="text-[#950740]">{cart.totalPrice?.toFixed(2)} ₽</span>
        </div>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.cartItems.map((item) => (
          <div key={item.cartItemId} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {item.product?.images && item.product.images.length > 0 ? (
                  <img
                    src={item.product.images[0].downloadUrl}
                    alt={item.product.productName}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {item.product?.productName || 'Неизвестный товар'}
                </h3>
                <p className="text-sm text-gray-500">
                  {item.product?.productBrand} {item.product?.productModel}
                </p>
                <div className="mt-1 flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Цена: {item.unitPrice?.toFixed(2)} ₽
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleUpdateQuantity(item.product.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.product.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              {/* Total Price and Remove Button */}
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-medium text-gray-900 mb-2">
                  {item.totalPrice?.toFixed(2)} ₽
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product.productId)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery Section */}
      {!showDeliveryForm ? (
        /* Button to show delivery form */
        <div className="border-t pt-6">
          <div className="flex justify-end">
            <button 
              onClick={() => setShowDeliveryForm(true)}
              className="px-8 py-3 bg-[#950740] hover:bg-[#7a052f] text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2m6 2a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2" />
              </svg>
              <span>Оформить доставку</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Delivery Form */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[#950740]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2m6 2a2 2 0 104 0m-4 0a2 2 0 114 0m-4 0v-2m4 2v-2" />
              </svg>
              Данные доставки
            </h3>
            <div className="space-y-4">
              {/* Delivery Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес доставки <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={deliveryData.deliveryAddress}
                  onChange={(e) => setDeliveryData({ ...deliveryData, deliveryAddress: e.target.value })}
                  placeholder="Введите адрес доставки"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#950740] focus:border-transparent"
                />
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Расстояние (км) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={deliveryData.distanceInKM}
                  onChange={(e) => setDeliveryData({ ...deliveryData, distanceInKM: e.target.value })}
                  placeholder="Введите расстояние в км"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#950740] focus:border-transparent"
                />
              </div>

              {/* Delivery Urgency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Срочность доставки <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-[#950740] transition-colors">
                    <input
                      type="radio"
                      name="deliveryUrgency"
                      value="STANDARD"
                      checked={deliveryData.deliveryUrgency === 'STANDARD'}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryUrgency: e.target.value })}
                      className="mt-1 w-4 h-4 text-[#950740] focus:ring-[#950740]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Стандартная доставка 3-4 дня</div>
                      <div className="text-sm text-gray-600">Коэффициент: 1.0x</div>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-[#950740] transition-colors">
                    <input
                      type="radio"
                      name="deliveryUrgency"
                      value="NEXT_DAY"
                      checked={deliveryData.deliveryUrgency === 'NEXT_DAY'}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryUrgency: e.target.value })}
                      className="mt-1 w-4 h-4 text-[#950740] focus:ring-[#950740]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Ускоренная доставка 2-3 дня</div>
                      <div className="text-sm text-gray-600">Коэффициент: 1.3x (+30%)</div>
                    </div>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-[#950740] transition-colors">
                    <input
                      type="radio"
                      name="deliveryUrgency"
                      value="SAME_DAY"
                      checked={deliveryData.deliveryUrgency === 'SAME_DAY'}
                      onChange={(e) => setDeliveryData({ ...deliveryData, deliveryUrgency: e.target.value })}
                      className="mt-1 w-4 h-4 text-[#950740] focus:ring-[#950740]"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Экстренная доставка 1 день</div>
                      <div className="text-sm text-gray-600">Коэффициент: 1.5x (+50%)</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="border-t pt-6">
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowDeliveryForm(false)}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Отмена
              </button>
              <button 
                onClick={handleCalculatePreview}
                disabled={isPlacingOrder}
                className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isPlacingOrder
                    ? 'bg-[#950740] bg-opacity-70 text-white cursor-wait'
                    : 'bg-[#950740] hover:bg-[#7a052f] text-white'
                }`}
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Расчёт заказа...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Рассчитать заказ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartView;
