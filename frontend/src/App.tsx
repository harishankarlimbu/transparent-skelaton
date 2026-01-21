import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">Vite + React</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Successfully set up with <span className="font-semibold text-teal-500">Tailwind CSS v4</span>
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform active:scale-95"
          >
            Count is {count}
          </button>
          
          <p className="text-sm text-gray-500">
            Edit <code className="bg-gray-100 px-1 rounded">src/App.tsx</code> to start building.
          </p>
        </div>
      </div>
      
      <div className="mt-12 flex space-x-6">
        <a href="https://vite.dev" target="_blank" className="hover:opacity-80 transition-opacity">
          <img src="/vite.svg" className="h-12 w-12" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:opacity-80 transition-opacity">
          <img src="./assets/react.svg" className="h-12 w-12" alt="React logo" />
        </a>
      </div>
    </div>
  )
}

export default App
