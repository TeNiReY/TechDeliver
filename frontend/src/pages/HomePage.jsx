import { useQuery } from '@apollo/client'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import Hero from '../components/Hero'
import { GET_ALL_CATEGORIES } from '../graphql/queries'

const HomePage = () => {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES)

  // Получаем категории из GraphQL ответа
  const categories = data?.getAllCategories?.categories || []
  
  // Получаем все продукты из всех категорий для секции "Популярные товары"
  const allProducts = categories.flatMap(category => category.products || [])

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8">
            <div className="inline-flex items-center mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-[#950740] to-[#B39CD0] rounded-full mr-3"></div>
              <span className="text-sm font-semibold text-[#950740] uppercase tracking-wider">
                Наши категории
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#950740] to-[#B39CD0] bg-clip-text text-transparent">
              Популярные категории
            </h2>
            <p className="text-gray-600 mt-2">Выберите категорию, которая вас интересует</p>
          </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-10">
            <div className="text-red-600 text-center">
              <p className="text-lg font-semibold mb-2">Ошибка загрузки категорий</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-gray-600 text-center">
              <p className="text-lg">Категории не найдены</p>
            </div>
          </div>
        )}
        </div>
      </section>

      {/* Декоративная полоса */}
      <div className="relative w-full py-12 bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-3 bg-white bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-[#B39CD0] to-purple-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">Качество</span>
              </div>
              <div className="flex items-center space-x-3 bg-white bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-[#950740] to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">Скорость</span>
              </div>
              <div className="flex items-center space-x-3 bg-white bg-opacity-80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-700">Забота</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-pink-50 via-white to-purple-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        {/* Pattern overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B39CD0' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8">
            <div className="inline-flex items-center mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-[#950740] rounded-full mr-3"></div>
              <span className="text-sm font-semibold text-[#950740] uppercase tracking-wider">
                Хиты продаж
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-[#950740] bg-clip-text text-transparent">
              Рекомендуемые товары
            </h2>
            <p className="text-gray-600 mt-2">Лучшие предложения специально для вас</p>
          </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-10">
            <div className="text-red-600 text-center">
              <p className="text-lg font-semibold mb-2">Ошибка загрузки товаров</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {!loading && !error && allProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {allProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && allProducts.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-gray-600 text-center">
              <p className="text-lg">Товары не найдены</p>
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  )
}

export default HomePage

