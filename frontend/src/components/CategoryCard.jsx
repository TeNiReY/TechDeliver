import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase()
    
    if (name.includes('холодильник') || name.includes('refrigerator')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      )
    } else if (name.includes('стиральн') || name.includes('washing')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      )
    } else if (name.includes('телевизор') || name.includes('tv')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      )
    } else if (name.includes('микроволн') || name.includes('microwave')) {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      )
    } else {
      return (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      )
    }
  }

  return (
    <Link to={`/category/${category.categoryId}`}>
      <div className="category-card bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 border-transparent hover:border-purple-500">
        <div className="flex flex-col items-center text-center">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-full mb-4">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {getCategoryIcon(category.categoryName)}
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.categoryName}</h3>
          <p className="text-gray-600 text-sm">{category.categoryDescription}</p>
        </div>
      </div>
    </Link>
  )
}

export default CategoryCard

