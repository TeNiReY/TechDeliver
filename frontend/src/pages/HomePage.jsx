import { useEffect, useState } from 'react'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import Hero from '../components/Hero'

const mockCategories = [
  { categoryId: '1', categoryName: 'Холодильники', categoryDescription: 'Надежные и экономичные модели' },
  { categoryId: '2', categoryName: 'Стиральные машины', categoryDescription: 'Фронтальные и вертикальные' },
  { categoryId: '3', categoryName: 'Телевизоры', categoryDescription: '4K, Smart TV, OLED, QLED' },
  { categoryId: '4', categoryName: 'Микроволновки', categoryDescription: 'Компактные и мощные' },
]

const mockProducts = [
  {
    productId: 'p1',
    productName: 'Холодильник Samsung RB30',
    price: 49990,
    inventory: 8,
    productBrand: 'Samsung',
    productModel: 'RB30',
    productDescription: 'Двухкамерный, No Frost, класс A+',
    productCategory: { categoryName: 'Холодильники' },
  },
  {
    productId: 'p2',
    productName: 'Стиральная машина LG F2',
    price: 37990,
    inventory: 2,
    productBrand: 'LG',
    productModel: 'F2',
    productDescription: 'Паровая стирка, 1200 об/мин',
    productCategory: { categoryName: 'Стиральные машины' },
  },
  {
    productId: 'p3',
    productName: 'Телевизор Sony X90',
    price: 89990,
    inventory: 0,
    productBrand: 'Sony',
    productModel: 'X90',
    productDescription: '55\", 4K, HDR, 120 Гц',
    productCategory: { categoryName: 'Телевизоры' },
  },
  {
    productId: 'p4',
    productName: 'Микроволновая печь Panasonic NN',
    price: 12990,
    inventory: 14,
    productBrand: 'Panasonic',
    productModel: 'NN',
    productDescription: 'Гриль, авто-режимы, 1000 Вт',
    productCategory: { categoryName: 'Микроволновки' },
  },
]

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCategories(mockCategories)
      setProducts(mockProducts)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-10 sm:py-13 lg:py-14 bg-gray-50">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Категории товаров</h2>
          <p className="text-base sm:text-lg text-gray-600">Выберите категорию для просмотра товаров</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.categoryId} category={category} />
            ))}
          </div>
        )}
      </section>

      <section className="py-10 sm:py-12 lg:py-14 bg-white">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Популярные товары</h2>
          <p className="text-base sm:text-lg text-gray-600">Лучшие предложения этого месяца</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="py-12 sm:py-14 lg:py-16 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center p-6 sm:p-7 lg:p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Быстрая доставка</h3>
            <p className="text-gray-600">Доставим ваш заказ в течение 1-2 дней</p>
          </div>

          <div className="text-center p-6 sm:p-7 lg:p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Гарантия качества</h3>
            <p className="text-gray-600">Официальная гарантия на всю технику</p>
          </div>

          <div className="text-center p-6 sm:p-7 lg:p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Безопасная оплата</h3>
            <p className="text-gray-600">Различные способы оплаты на ваш выбор</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

