import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-[#B39CD0] to-[#9575CD] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>
      
      <div className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Добро пожаловать в 
            <span className="block text-white">
              TechDeliver
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Ваш надежный партнер в мире современной техники. 
            Широкий ассортимент, быстрая доставка и лучшие цены.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link 
              to="/catalog" 
              className="group bg-white text-[#B39CD0] px-8 py-4 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Смотреть каталог
            </Link>
            <Link 
              to="/about" 
              className="group border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#B39CD0] transition-all duration-300 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Узнать больше
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

