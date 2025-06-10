import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">          <h1 className="text-6xl font-bold mb-6 flex items-center justify-center gap-4">
            <span className="bg-gradient-to-r from-blue-700 via-purple-700 to-blue-900 bg-clip-text text-transparent">
              Bem-vindo ao BookHub!
            </span>
            <span className="text-6xl">📚</span>
          </h1>          <p className="text-xl text-gray-900 mb-12 leading-relaxed font-semibold">
            Sua biblioteca digital completa. Descubra, gerencie e reserve livros de forma simples e intuitiva.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/books"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-xl">📖</span>
              Ver Catálogo de Livros
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/reservations"
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-xl">📋</span>
              Minhas Reservas
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-300">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Descobrir Livros</h3>            <p className="text-gray-900 font-bold">
              Explore nosso vasto catálogo de livros organizados por categoria, autor e disponibilidade.
            </p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-300">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Reserva Rápida</h3>            <p className="text-gray-900 font-bold">
              Reserve seus livros favoritos com apenas alguns cliques e gerencie suas reservas facilmente.
            </p>
          </div>
          
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-gray-300">
            <div className="text-5xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Interface Moderna</h3>            <p className="text-gray-900 font-bold">
              Design responsivo e intuitivo que funciona perfeitamente em qualquer dispositivo.
            </p>
          </div>
        </div>
      </div>      {/* About Section */}
      <div className="bg-white border-2 border-gray-300 rounded-2xl p-8 mx-4 mb-16 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-3">
            <span className="text-4xl">🚀</span>
            Sobre o Projeto
          </h2>          <p className="text-gray-900 text-lg leading-relaxed font-semibold">
            Esta aplicação é uma demonstração de arquitetura orientada a microsserviços
            para gerenciamento de biblioteca digital. Construída com Next.js no frontend
            e serviços NestJS independentes para livros e reservas, oferecendo uma
            experiência moderna e escalável.
          </p>
          <div className="flex justify-center gap-6 mt-8 text-sm text-gray-900 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              Next.js Frontend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              NestJS Backend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
              Microsserviços
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
