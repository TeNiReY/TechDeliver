import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProfileInfo from '../components/ProfileInfo'
import CartView from '../components/CartView'
import OrdersView from '../components/OrdersView'

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
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Адреса доставки</h2>
            <div className="rounded-lg border border-gray-200 p-6 text-gray-600">Добавьте адрес для быстрой доставки.</div>
          </div>
        )
      case 'favorites':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Избранное</h2>
            <div className="rounded-lg border border-gray-200 p-6 text-gray-600">Сохранённые товары появятся здесь.</div>
          </div>
        )
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

  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left px-5 py-4 border-b last:border-b-0 transition-all duration-200 ${
                    active === s.id
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border-l-4 border-l-purple-600 font-medium'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-purple-600'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-sm">{s.title}</span>
                    {active === s.id && (
                      <svg className="w-4 h-4 ml-auto text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <section className="md:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
              {renderContent()}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


