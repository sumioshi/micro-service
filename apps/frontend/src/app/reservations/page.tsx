'use client';

import React, { useEffect } from 'react';
import { useReservationStore } from '@/store/reservationStore'; // Adjust path
import ReservationListItem from '@/components/ReservationListItem'; // Adjust path
import { useBookStore } from '@/store/bookStore'; // To fetch book details for titles

const ReservationsPage = () => {
  const {
    reservations,
    isLoading,
    error,
    fetchReservations,
    cancelExistingReservation
  } = useReservationStore();

  // Access book store to potentially enrich reservation data with book titles
  // This is a simple client-side join; ideally, backend would provide this
  const { books: allBooks, fetchBooks:fetchAllBooks, books: bookStoreBooks } = useBookStore();

  // Hardcoded userId for now
  const hardcodedUserId = 'user123';

  useEffect(() => {
    fetchReservations(hardcodedUserId);
    if (bookStoreBooks.length === 0) { // Fetch all books if not already in store, for titles
        fetchAllBooks();
    }
  }, [fetchReservations, fetchAllBooks, bookStoreBooks.length]);

  const handleCancelReservation = async (reservationId: string) => {
    if(confirm('Are you sure you want to cancel this reservation?')) {
      await cancelExistingReservation(reservationId);
      // Optionally re-fetch reservations or rely on store's optimistic update
      // fetchReservations(hardcodedUserId); // Re-fetch for certainty if store update is complex
    }
  };

  // Enrich reservations with book titles
  const enrichedReservations = reservations.map(res => {
    const book = allBooks.find(b => b.id === res.bookId);
    return {
      ...res,
      bookTitle: book ? book.titulo : 'Loading title...'
    };
  });

  if (isLoading && reservations.length === 0) return <p className="text-center text-gray-500">Loading reservations...</p>;
  if (error) return <p className="text-center text-red-500">Error loading reservations: {error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
      {isLoading && <p className="text-center text-gray-500 mb-4">Updating reservations list...</p>}
      {enrichedReservations.length === 0 && !isLoading ? (
        <p className="text-center text-gray-500">You have no active reservations.</p>
      ) : (
        <div className="space-y-4">
          {enrichedReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
              <ReservationListItem reservation={reservation} />
              {reservation.status === 'ativa' && (
                 <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors"
                    disabled={isLoading} // Disable button while any loading is happening
                  >
                    Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
