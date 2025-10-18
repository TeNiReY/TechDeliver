import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useParams, useNavigate } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { GET_ALL_CATEGORIES, GET_PRODUCTS_BY_CATEGORY } from '../graphql/queries'

const CatalogPage = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Загружаем все категории
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_ALL_CATEGORIES)
  
  // Загружаем товары по выбранной категории
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    {
      variables: { categoryId },
      skip: !categoryId
    }
  )

  const categories = categoriesData?.getAllCategories?.categories || []
  const products = productsData?.getProductsByCategory || []

  // Получаем информацию о выбранной категории
  const currentCategory = categoryId ? categories.find(cat => cat.categoryId === categoryId) : null

  // Если есть categoryId в URL, показываем товары этой категории
  const showProducts = categoryId && !productsLoading && !productsError
  const showCategories = !categoryId || (categoryId && products.length === 0 && !productsLoading)

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    navigate(`/catalog/${category.categoryId}`)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    navigate('/catalog')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Хлебные крошки */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-purple-600 transition-colors"
          >
            Главная
          </button>
          <span>/</span>
          <button 
            onClick={handleBackToCategories}
            className="hover:text-purple-600 transition-colors"
          >
            Каталог
          </button>
          {currentCategory && (
            <>
              <span>/</span>
              <span className="text-gray-900">{currentCategory.categoryName}</span>
            </>
          )}
        </nav>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {categoryId ? currentCategory?.categoryName || 'Товары' : 'Каталог товаров'}
          </h1>
          <p className="text-gray-600">
            {categoryId 
              ? `Товары в категории "${currentCategory?.categoryName}"` 
              : 'Выберите категорию для просмотра товаров'
            }
          </p>
        </div>

        {/* Кнопка "Назад к категориям" для мобильных устройств */}
        {categoryId && (
          <div className="mb-6 md:hidden">
            <button
              onClick={handleBackToCategories}
              className="flex items-center text-purple-600 hover:text-purple-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад к категориям
            </button>
          </div>
        )}

        {/* Отображение категорий */}
        {!categoryId && (
          <>
            {categoriesLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
              </div>
            )}

            {categoriesError && (
              <div className="flex justify-center items-center py-20">
                <div className="text-red-600 text-center">
                  <p className="text-lg font-semibold mb-2">Ошибка загрузки категорий</p>
                  <p className="text-sm">{categoriesError.message}</p>
                </div>
              </div>
            )}

            {!categoriesLoading && !categoriesError && categories.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard 
                    key={category.categoryId} 
                    category={category} 
                    onClick={() => handleCategoryClick(category)}
                  />
                ))}
              </div>
            )}

            {!categoriesLoading && !categoriesError && categories.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-600 text-center">
                  <p className="text-lg">Категории не найдены</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Отображение товаров */}
        {categoryId && (
          <>
            {productsLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
              </div>
            )}

            {productsError && (
              <div className="flex justify-center items-center py-20">
                <div className="text-red-600 text-center">
                  <p className="text-lg font-semibold mb-2">Ошибка загрузки товаров</p>
                  <p className="text-sm">{productsError.message}</p>
                </div>
              </div>
            )}

            {!productsLoading && !productsError && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}

            {!productsLoading && !productsError && products.length === 0 && (
              <div className="flex justify-center items-center py-20">
                <div className="text-gray-600 text-center">
                  <p className="text-lg">В этой категории пока нет товаров</p>
                  <button
                    onClick={handleBackToCategories}
                    className="mt-4 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Вернуться к категориям
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CatalogPage


