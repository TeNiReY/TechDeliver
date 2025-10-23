const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-3">
              <svg className="w-6 h-6 text-[#B39CD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#B39CD0] to-purple-400 bg-clip-text text-transparent">TechDeliver</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Интернет-магазин бытовой техники с быстрой доставкой.
            </p>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="text-base font-bold mb-3 text-[#B39CD0]">Информация</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#B39CD0] transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-[#B39CD0] rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  О компании
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#B39CD0] transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-[#B39CD0] rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Доставка
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#B39CD0] transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-[#B39CD0] rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Оплата
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#B39CD0] transition-colors text-sm flex items-center group">
                  <span className="w-1 h-1 bg-[#B39CD0] rounded-full mr-2 group-hover:w-2 transition-all duration-200"></span>
                  Гарантия
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-base font-bold mb-3 text-[#B39CD0]">Контакты</h3>
            <ul className="space-y-2">
              <li>
                <a href="tel:+78001234567" className="flex items-center text-gray-400 hover:text-[#B39CD0] transition-colors group text-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-800 bg-opacity-50 flex items-center justify-center mr-3 group-hover:bg-[#B39CD0] transition-all duration-200 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span>+7 (800) 123-45-67</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@techdeliver.ru" className="flex items-center text-gray-400 hover:text-[#B39CD0] transition-colors group text-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-800 bg-opacity-50 flex items-center justify-center mr-3 group-hover:bg-[#B39CD0] transition-all duration-200 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>info@techdeliver.ru</span>
                </a>
              </li>
              <li>
                <div className="flex items-center text-gray-400 text-sm">
                  <div className="w-8 h-8 rounded-full bg-purple-800 bg-opacity-50 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>Минск, улица Игоря Лученка 27</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-800 border-opacity-50 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 text-xs text-gray-400">
            <p>&copy; 2024 TechDeliver. Все права защищены.</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-[#B39CD0] transition-colors">Политика конфиденциальности</a>
              <span className="text-gray-600">|</span>
              <a href="#" className="hover:text-[#B39CD0] transition-colors">Условия использования</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

