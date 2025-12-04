import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_BY_ID, ADD_ITEM_TO_CART, GET_CART_QUERY, SAVE_PRODUCT, UNSAVE_PRODUCT, GET_USER_SAVED_PRODUCTS } from '../graphql/queries';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSaved, toggleFavorite } = useFavorites();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId },
  });

  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART, {
    refetchQueries: [{ query: GET_CART_QUERY, variables: { userId: user?.userId } }],
    onCompleted: () => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    },
    onError: (error) => {
      console.error('Error adding item to cart:', error);
      setIsAdding(false);
    }
  });

  const [saveProduct] = useMutation(SAVE_PRODUCT, {
    refetchQueries: [{ query: GET_USER_SAVED_PRODUCTS, variables: { userId: user?.userId } }],
    onCompleted: () => {
      toggleFavorite(productId);
    },
  });

  const [unsaveProduct] = useMutation(UNSAVE_PRODUCT, {
    refetchQueries: [{ query: GET_USER_SAVED_PRODUCTS, variables: { userId: user?.userId } }],
    onCompleted: () => {
      toggleFavorite(productId);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Ошибка загрузки товара</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  const product = data?.getProductById;
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Товар не найден</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  const saved = isSaved(product.productId);
  const isInStock = product.inventory > 0;

  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericPrice) + ' Br';
  };

  const handleAddToCart = async () => {
    if (!user?.userId) {
      alert('Необходимо войти в систему для добавления товаров в корзину');
      navigate('/login');
      return;
    }

    setIsAdding(true);
    try {
      await addItemToCart({
        variables: {
          userId: user.userId,
          productId: product.productId,
          quantity: quantity
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleSave = async () => {
    if (!user?.userId) {
      alert('Необходимо войти в систему для сохранения товаров');
      navigate('/login');
      return;
    }

    try {
      if (saved) {
        await unsaveProduct({
          variables: { productId: product.productId, userId: user.userId }
        });
      } else {
        await saveProduct({
          variables: { productId: product.productId, userId: user.userId }
        });
      }
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.inventory) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-purple-600 transition-colors">
            Главная
          </button>
          <span>/</span>
          <button onClick={() => navigate('/catalog')} className="hover:text-purple-600 transition-colors">
            Каталог
          </button>
          {product.productCategory && (
            <>
              <span>/</span>
              <button
                onClick={() => navigate(`/catalog/${product.productCategory.categoryId}`)}
                className="hover:text-purple-600 transition-colors"
              >
                {product.productCategory.categoryName}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{product.productName}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Product Image Gallery */}
            <div className="relative">
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative rounded-xl overflow-hidden h-96 lg:h-[500px] bg-gray-100">
                    <img
                      src={product.images[currentImageIndex].downloadUrl}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-lg transition-all"
                        >
                          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {product.images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {product.images.length}
                      </div>
                    )}

                    {/* Stock Badge */}
                    {!isInStock && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Нет в наличии
                      </div>
                    )}
                    {isInStock && product.inventory < 5 && (
                      <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        Осталось {product.inventory} шт.
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === index
                              ? 'border-[#B39CD0] ring-2 ring-[#B39CD0] ring-opacity-50'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={image.downloadUrl}
                            alt={`${product.productName} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center h-96 lg:h-[500px]">
                  <svg className="w-32 h-32 text-[#B39CD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              {product.productCategory && (
                <span className="inline-block bg-purple-100 text-[#B39CD0] text-sm px-3 py-1 rounded-full mb-4 w-fit">
                  {product.productCategory.categoryName}
                </span>
              )}

              {/* Product Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.productName}
              </h1>

              {/* Brand & Model */}
              <div className="flex items-center space-x-4 mb-6 text-gray-600">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Бренд:</span>
                  <span>{product.productBrand}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Модель:</span>
                  <span>{product.productModel}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-4xl font-bold text-[#B39CD0] mb-2">
                  {formatPrice(product.price)}
                </div>
                <div className="text-sm text-gray-500">
                  {isInStock ? `В наличии: ${product.inventory} шт.` : 'Товар закончился'}
                </div>
              </div>

              {/* Description */}
              {product.productDescription && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание</h3>
                  <p className="text-gray-600 leading-relaxed">{product.productDescription}</p>
                </div>
              )}

              {/* Specifications */}
              <div className="mb-6 bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Характеристики</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Вес</span>
                    <span className="font-semibold text-gray-900">{product.productWeight} кг</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Ширина</span>
                    <span className="font-semibold text-gray-900">{(product.productWidth * 100).toFixed(1)} см</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Длина</span>
                    <span className="font-semibold text-gray-900">{(product.productLength * 100).toFixed(1)} см</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 mb-1">Высота</span>
                    <span className="font-semibold text-gray-900">{(product.productHeight * 100).toFixed(1)} см</span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              {isInStock && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Количество</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.inventory}
                      className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isInStock || isAdding}
                  className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    isInStock && !isAdding
                      ? 'bg-[#B39CD0] text-white hover:bg-[#9575CD] hover:shadow-lg'
                      : isAdding
                      ? 'bg-[#B39CD0] bg-opacity-70 text-white cursor-wait'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAdding ? 'Добавляем...' : showSuccess ? 'Добавлено!' : isInStock ? 'Добавить в корзину' : 'Недоступно'}
                </button>

                <button
                  onClick={handleToggleSave}
                  className="w-14 h-14 rounded-xl bg-white border-2 border-gray-300 hover:border-[#B39CD0] flex items-center justify-center transition-all"
                >
                  <svg
                    className={`w-7 h-7 transition-colors ${saved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                    fill={saved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
