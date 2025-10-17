const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const isInStock = product.inventory > 0

  return (
    <div className="product-card">
      <div className="relative">
        <div className="bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center h-56 sm:h-60 lg:h-64">
          <svg className="w-20 h-20 sm:w-24 sm:h-24 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {!isInStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Нет в наличии
          </div>
        )}
        {isInStock && product.inventory < 5 && (
          <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Мало в наличии
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {product.productCategory.categoryName}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.productBrand} {product.productModel}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.productDescription || product.productName}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {formatPrice(product.price)}
            </div>
            <div className="text-xs text-gray-500">
              {isInStock ? `В наличии: ${product.inventory} шт.` : 'Товар закончился'}
            </div>
          </div>
        </div>

        <button 
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            isInStock
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isInStock}
        >
          {isInStock ? 'В корзину' : 'Недоступно'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard

