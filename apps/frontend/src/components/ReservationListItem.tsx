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

const ReservationListItem: React.FC<ReservationListItemProps> = ({ reservation }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm mb-4">
      <h4 className="text-lg font-semibold mb-1">
        Reservation ID: {reservation.id}
      </h4>
      <p className="text-gray-700">
        Book ID: {reservation.bookId}
        {reservation.bookTitle && ` (${reservation.bookTitle})`}
      </p>
      <p className="text-gray-700">Date: {reservation.dataReserva}</p>
      <p className="text-sm">
        Status: <span className={`font-medium ${
          reservation.status === 'ativa' ? 'text-green-600' :
          reservation.status === 'cancelada' ? 'text-red-600' :
          'text-gray-600'
        }`}>{reservation.status}</span>
      </p>
      {/* Placeholder for cancel button or other actions */}
      {reservation.status === 'ativa' && (
        <button className="mt-2 text-sm text-red-500 hover:text-red-700">
          Cancel Reservation (placeholder)
        </button>
      )}
    </div>
  );
};

export default ReservationListItem;
