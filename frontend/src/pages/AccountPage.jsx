import { useState } from 'react'

const sections = [
  { id: 'profile', title: 'Профиль' },
  { id: 'orders', title: 'Мои заказы' },
  { id: 'addresses', title: 'Адреса доставки' },
  { id: 'favorites', title: 'Избранное' },
  { id: 'security', title: 'Безопасность' },
]

const AccountPage = () => {
  const [active, setActive] = useState('profile')

  const renderContent = () => {
    switch (active) {
      case 'profile':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Профиль</h2>
            <p className="text-gray-600">Здесь появится редактирование профиля и привязка телефона/email.</p>
          </div>
        )
      case 'orders':
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Мои заказы</h2>
            <div className="rounded-lg border border-gray-200 p-6 text-gray-600">Пока заказов нет.</div>
          </div>
        )
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
            <p className="text-gray-600 mb-4">В будущем: вход/выход, смена пароля, JWT, 2FA.</p>
            <button className="px-5 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Войти</button>
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
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left px-5 py-4 border-b last:border-b-0 transition-colors ${
                    active === s.id
                      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </aside>

          <section className="md:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              {renderContent()}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AccountPage


