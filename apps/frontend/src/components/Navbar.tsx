import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          BookHub
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/books" className="hover:text-gray-300">
              Books
            </Link>
          </li>
          <li>
            <Link href="/reservations" className="hover:text-gray-300">
              My Reservations
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
