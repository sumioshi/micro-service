'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For accessing route params
import Link from 'next/link';
import { useBookStore } from '@/store/bookStore'; // Adjust path
import { useReservationStore } from '@/store/reservationStore'; // Adjust path
import { Book } from '@/components/BookCard'; // Adjust path

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    selectedBook,
    isLoading: bookLoading,
    error: bookError,
    fetchBookById,
    // No need to call setBookStatus directly from component, store action handles it
  } = useBookStore();

  const {
    addReservation,
    isLoading: reservationLoading,
    error: reservationError
  } = useReservationStore();

  useEffect(() => {
    if (id) {
      fetchBookById(id);
    }
  }, [id, fetchBookById]);

  const handleReserveBook = async () => {
    if (!selectedBook || selectedBook.status !== 'disponível') {
      alert('This book cannot be reserved at the moment.');
      return;
    }

    // Hardcoded userId for now, replace with actual logged-in user ID
    const hardcodedUserId = 'user123';
    const reservationData = {
      bookId: selectedBook.id,
      userId: hardcodedUserId,
      dataReserva: new Date().toISOString().split('T')[0], // Today's date "YYYY-MM-DD"
    };

    const newReservation = await addReservation(reservationData);
    if (newReservation) {
      alert(`Book "${selectedBook.titulo}" reserved successfully! Reservation ID: ${newReservation.id}`);
      // The stores should now handle status updates. selectedBook will re-render.
      // No need to manually call fetchBookById(id) here if stores are linked correctly,
      // as setBookStatus in bookStore should update selectedBook.
      router.push('/reservations');
    } else {
      alert(`Failed to reserve book: ${reservationError || 'Unknown error'}`);
    }
  };

  // Conditional rendering based on loading/error states for the book
  let content;
  if (bookLoading && !selectedBook) { // Show loading only if no book data is present yet
    content = <p className="text-center text-gray-500">Loading book details...</p>;
  } else if (bookError && !selectedBook) { // Show error if no book data and error occurred
    content = <p className="text-center text-red-500">Error loading book: {bookError}</p>;
  } else if (!selectedBook) {
    // This case handles after loading, if book is still not found.
    content = <p className="text-center text-gray-500">Book not found.</p>;
  } else {
    // Book details display using the selectedBook from the store
    content = (
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-700">{selectedBook.titulo}</h1>
        <p className="text-lg text-gray-700 mb-2"><span className="font-semibold">Autor:</span> {selectedBook.autor}</p>
        <p className="text-md mb-4">
          <span className="font-semibold">Status:</span>
          <span className={`ml-2 font-medium ${
            selectedBook.status === 'disponível' ? 'text-green-600' :
            selectedBook.status === 'reservado' ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {selectedBook.status}
          </span>
        </p>

        <button
          onClick={handleReserveBook}
          disabled={reservationLoading || selectedBook.status !== 'disponível'}
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {reservationLoading ? 'Reserving...' :
           selectedBook.status === 'disponível' ? 'Reserve this Book' : `Cannot Reserve (Status: ${selectedBook.status})`
          }
        </button>
        {reservationError && <p className="text-red-500 mt-2">Reservation Error: {reservationError}</p>}

        <div className="mt-8">
          <Link href="/books" className="text-indigo-600 hover:text-indigo-800 transition-colors">
            &larr; Back to Books List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      {content}
    </div>
  );
};

export default BookDetailPage;
