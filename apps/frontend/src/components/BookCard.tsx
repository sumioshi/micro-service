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

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'disponível':
      return { color: 'text-green-800', bg: 'bg-green-200', icon: '✅', text: 'Disponível' };
    case 'reservado':
      return { color: 'text-amber-800', bg: 'bg-amber-200', icon: '📅', text: 'Reservado' };
    case 'emprestado':
      return { color: 'text-blue-800', bg: 'bg-blue-200', icon: '📚', text: 'Emprestado' };
    case 'perdido':
      return { color: 'text-red-800', bg: 'bg-red-200', icon: '❌', text: 'Perdido' };
    default:
      return { color: 'text-gray-800', bg: 'bg-gray-200', icon: '❓', text: status };
  }
};

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const statusInfo = getStatusInfo(book.status);
    return (
    <div className="group bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl mb-2">📖</div>
        <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1 border border-current`}>
          <span>{statusInfo.icon}</span>
          {statusInfo.text}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">
        {book.titulo}
      </h3>
      
      <div className="flex items-center gap-2 text-gray-800 mb-4">
        <span className="text-sm">✍️</span>
        <p className="text-gray-800 font-semibold">{book.autor}</p>
      </div>
        <Link
        href={`/books/${book.id}`}
        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-bold transition-colors group-hover:gap-3 underline decoration-2 underline-offset-2"
      >
        Ver Detalhes
        <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default BookCard;
