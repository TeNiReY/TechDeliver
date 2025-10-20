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

      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Популярные категории
            </h2>
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
      <div className="w-full py-8 bg-white">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#B39CD0] to-transparent opacity-50"></div>
      </div>

      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Рекомендуемые товары
            </h2>
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

