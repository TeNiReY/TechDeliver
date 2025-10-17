import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="hero-gradient text-white">
      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Бытовая техника с доставкой
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Широкий ассортимент качественной техники для вашего дома
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link 
              to="/catalog" 
              className="btn-primary px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Смотреть каталог
            </Link>
            <Link 
              to="/about" 
              className="bg-white text-purple-600 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300"
            >
              Узнать больше
            </Link>
          </div>
        </div>

        <div className="mt-12 sm:mt-14 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-5 sm:p-6 card-hover">
            <div className="text-3xl sm:text-4xl font-bold mb-1.5 sm:mb-2">1000+</div>
            <div className="text-purple-100">Товаров</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-5 sm:p-6 card-hover">
            <div className="text-3xl sm:text-4xl font-bold mb-1.5 sm:mb-2">24/7</div>
            <div className="text-purple-100">Поддержка</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-5 sm:p-6 card-hover">
            <div className="text-3xl sm:text-4xl font-bold mb-1.5 sm:mb-2">5000+</div>
            <div className="text-purple-100">Клиентов</div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-5 sm:p-6 card-hover">
            <div className="text-3xl sm:text-4xl font-bold mb-1.5 sm:mb-2">100%</div>
            <div className="text-purple-100">Качество</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

