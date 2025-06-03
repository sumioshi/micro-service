import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-6 text-indigo-700">Welcome to BookHub!</h1>
      <p className="text-lg text-gray-700 mb-8">
        Your one-stop place to discover, manage, and reserve books.
      </p>
      <div className="space-x-4">
        <Link
          href="/books"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          View Books
        </Link>
        <Link
          href="/reservations"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          My Reservations
        </Link>
      </div>
      <div className="mt-12 p-6 border border-gray-200 rounded-lg bg-white shadow">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">About This Project</h2>
        <p className="text-gray-600">
          This application is a demonstration of a microservices-oriented architecture
          for managing books and reservations. It features a Next.js frontend
          and separate NestJS backend services for books and reservations.
        </p>
      </div>
    </div>
  );
}
