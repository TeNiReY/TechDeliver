import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProfileInfo from '../components/ProfileInfo'
import CartView from '../components/CartView'
import OrdersView from '../components/OrdersView'
import FavoritesView from '../components/FavoritesView'
import DeliveryAddressView from '../components/DeliveryAddressView'

const sections = [
  { id: 'profile', title: 'Профиль' },
  { id: 'cart', title: 'Корзина' },
  { id: 'orders', title: 'Мои заказы' },
  { id: 'addresses', title: 'Адреса доставки' },
  { id: 'favorites', title: 'Избранное' },
  { id: 'security', title: 'Безопасность' },
]

const AccountPage = () => {
  const [active, setActive] = useState('profile')
  const { user, logout } = useAuth()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && sections.some(section => section.id === tab)) {
      setActive(tab)
    }
  }, [searchParams])

  const renderContent = () => {
    switch (active) {
      case 'profile':
        return <ProfileInfo />
      case 'cart':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Корзина</h2>
            <CartView />
          </div>
        )
      case 'orders':
        return <OrdersView />
      case 'addresses':
        return <DeliveryAddressView />
      case 'favorites':
        return <FavoritesView />
      case 'security':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Безопасность</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Управление безопасностью аккаунта.</p>
              <div className="border-t pt-4">
                <button 
                  onClick={logout}
                  className="px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Выйти из аккаунта
                </button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getSectionIcon = (id) => {
    switch (id) {
      case 'profile':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'cart':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )
      case 'orders':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        )
      case 'addresses':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'favorites':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      case 'security':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#950740] via-[#B39CD0] to-purple-600 bg-clip-text text-transparent mb-2">
            Личный кабинет
          </h1>
          <p className="text-gray-600">Управляйте своим профилем и заказами</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl border border-purple-100 overflow-hidden shadow-lg">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left px-5 py-4 border-b last:border-b-0 transition-all duration-200 group ${
                    active === s.id
                      ? 'bg-gradient-to-r from-[#950740] to-[#B39CD0] text-white font-semibold shadow-md'
                      : 'hover:bg-purple-50 text-gray-700 hover:text-[#950740]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${active === s.id ? 'text-white' : 'text-[#B39CD0] group-hover:text-[#950740]'} transition-colors`}>
                      {getSectionIcon(s.id)}
                    </div>
                    <span className="text-sm flex-1">{s.title}</span>
                    {active === s.id && (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="md:col-span-3">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl border border-purple-100 p-6 md:p-8 shadow-lg">
              {renderContent()}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


