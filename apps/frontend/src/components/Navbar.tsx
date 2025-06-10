import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md border-b-2 border-gray-300 sticky top-0 z-50 backdrop-blur-sm bg-white/98">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent hover:scale-105 transition-transform">
            📚 BookHub
          </Link>
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className="text-gray-800 hover:text-blue-700 font-semibold transition-colors duration-200 hover:scale-105 transform">
                🏠 Início
              </Link>
            </li>
            <li>
              <Link href="/books" className="text-gray-800 hover:text-blue-700 font-semibold transition-colors duration-200 hover:scale-105 transform">
                📖 Livros
              </Link>
            </li>
            <li>
              <Link href="/reservations" className="text-gray-800 hover:text-blue-700 font-semibold transition-colors duration-200 hover:scale-105 transform">
                📋 Minhas Reservas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
