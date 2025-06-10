// Define a Reservation type for props
export interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  dataReserva: string; // ISO Date string "YYYY-MM-DD"
  status: 'ativa' | 'cancelada' | 'concluída' | 'expirada'; // Example statuses
  // We might want to include bookTitle here in the future after fetching/joining data
  bookTitle?: string;
}

interface ReservationListItemProps {
  reservation: Reservation;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'ativa':
      return { color: 'text-green-800', bg: 'bg-green-200', icon: '✅', text: 'Ativa' };
    case 'cancelada':
      return { color: 'text-red-800', bg: 'bg-red-200', icon: '❌', text: 'Cancelada' };
    case 'concluída':
      return { color: 'text-blue-800', bg: 'bg-blue-200', icon: '✓', text: 'Concluída' };
    case 'expirada':
      return { color: 'text-amber-800', bg: 'bg-amber-200', icon: '⏰', text: 'Expirada' };
    default:
      return { color: 'text-gray-800', bg: 'bg-gray-200', icon: '❓', text: status };
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const ReservationListItem: React.FC<ReservationListItemProps> = ({ reservation }) => {
  const statusInfo = getStatusInfo(reservation.status);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📋</div>            <div>
              <h4 className="text-lg font-bold text-gray-900">
                Reserva #{reservation.id.slice(-8)}
              </h4>
              <p className="text-sm text-gray-700 font-medium">ID: {reservation.id}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${statusInfo.bg} ${statusInfo.color} flex items-center gap-1 border border-current`}>
            <span>{statusInfo.icon}</span>
            {statusInfo.text}
          </span>
        </div>        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900">
            <span className="text-sm">📖</span>
            <span className="font-bold">
              {reservation.bookTitle ? reservation.bookTitle : `Livro ID: ${reservation.bookId}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-800">
            <span className="text-sm">📅</span>
            <span className="text-sm font-semibold">
              Reservado em: {formatDate(reservation.dataReserva)}
            </span>
          </div>

          {reservation.status === 'ativa' && (
            <div className="flex items-center gap-2 text-blue-800">
              <span className="text-sm">ℹ️</span>
              <span className="text-sm font-medium">
                Esta reserva está ativa e pode ser cancelada a qualquer momento
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationListItem;
