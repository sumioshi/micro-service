import Link from 'next/link';

// Define a Book type for props, you might want to move this to a types/interfaces file later
export interface Book {
  id: string;
  titulo: string;
  autor: string;
  status: 'disponível' | 'reservado' | 'emprestado' | 'perdido'; // Example statuses
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{book.titulo}</h3>
      <p className="text-gray-700 mb-1">Autor: {book.autor}</p>
      <p className="text-sm mb-3">
        Status: <span className={`font-medium ${
          book.status === 'disponível' ? 'text-green-600' : 'text-yellow-600'
        }`}>{book.status}</span>
      </p>
      <Link
        href={`/books/${book.id}`}
        className="text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        View Details
      </Link>
    </div>
  );
};

export default BookCard;
