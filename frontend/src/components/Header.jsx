import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useAuth } from '../contexts/AuthContext'
import { GET_CART_QUERY, GET_USER_PROFILE } from '../graphql/queries'
import { useState, useEffect } from 'react'

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const { data: cartData } = useQuery(GET_CART_QUERY, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    pollInterval: 5000, // Обновляем каждые 5 секунд
  });

  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_PROFILE, {
    variables: { userId: user?.userId },
    skip: !user?.userId,
    fetchPolicy: 'cache-and-network', // Всегда получаем свежие данные
  });

  console.log('Header - user:', user);
  console.log('Header - userData:', userData);
  console.log('Header - userLoading:', userLoading);
  console.log('Header - userError:', userError);

  const cartItemCount = cartData?.getCart?.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const savedAddress = userData?.getUserProfileInfo?.savedDeliveryAddress || 'Минск, улица Игоря Лученка 27';

  const handleLogout = () => {
    logout();
  };

  // Закрытие меню при уходе мыши
  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [showProfileMenu]);

  return (
    <header className="bg-[#B39CD0] sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#B39CD0] bg-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-8 text-sm text-white">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{savedAddress}</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/club" className="hover:text-gray-200 transition-colors">TechDeliver Клуб</Link>
              <Link to="/brands" className="hover:text-gray-200 transition-colors">Бренды</Link>
              <div className="flex items-center space-x-1 hover:text-gray-200 transition-colors cursor-pointer">
                <span>Для бизнеса</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <Link to="/careers" className="hover:text-gray-200 transition-colors">Работа в TechDeliver</Link>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                <span className="font-semibold">Б</span> 0,00 ₽
              </div>
              <div className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs flex items-center space-x-1">
                <div className="w-3 h-2 bg-red-500 rounded-sm"></div>
                <span>BYN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">TechDeliver</span>
            </Link>
            
            {/* Catalog Button */}
            <Link 
              to="/catalog" 
              className="hidden md:flex items-center bg-white text-[#B39CD0] px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Каталог
            </Link>
            
            <button className="md:hidden bg-white bg-opacity-20 p-2 rounded">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Найти на TechDeliver"
                className="w-full px-4 py-3 pr-12 rounded-lg text-gray-900 placeholder-gray-500 bg-white border-2 border-white focus:outline-none focus:ring-2 focus:ring-[#B39CD0] focus:ring-opacity-50"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-6">
            {/* Orders */}
            <Link to="/orders" className="flex flex-col items-center text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-xs">Заказы</span>
            </Link>

            {/* Favorites */}
            <Link to="/favorites" className="flex flex-col items-center text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">Избранное</span>
            </Link>

            {/* Profile */}
            {isAuthenticated() ? (
              <div className="relative profile-menu-container">
                <div 
                  className="flex flex-col items-center"
                  onMouseEnter={() => setShowProfileMenu(true)}
                  onMouseLeave={() => setShowProfileMenu(false)}
                >
                  <Link 
                    to="/account"
                    className="flex flex-col items-center text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs">Профиль</span>
                  </Link>
                  
                  {/* Невидимая область для плавного перехода */}
                  {showProfileMenu && (
                    <div className="absolute top-full w-full h-2 bg-transparent"></div>
                  )}
                </div>
                
                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div 
                    className="absolute right-1/2 transform translate-x-1/2 top-full w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                  >
                    <div className="py-2">
                      <Link 
                        to="/purchases" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Покупки
                        </div>
                      </Link>
                      <Link 
                        to="/favorites" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Избранное
                        </div>
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Заказы
                        </div>
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Выйти
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center text-white hover:text-gray-200 transition-colors">
                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-xs">Профиль</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="flex flex-col items-center text-white hover:text-gray-200 transition-colors relative">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs">Корзина</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

