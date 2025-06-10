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
    if(confirm('Tem certeza que deseja cancelar esta reserva?')) {
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
      bookTitle: book ? book.titulo : 'Carregando título...'
    };
  });

  if (isLoading && reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-800 text-lg font-semibold">Carregando suas reservas...</p>
      </div>
    );
  }

  if (error) {
    return (      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-red-700 text-lg mb-4 font-semibold">Erro ao carregar reservas: {error}</p>
        <button 
          onClick={() => fetchReservations(hardcodedUserId)} 
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-300">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              📋 Minhas Reservas
            </h1>
            <p className="text-gray-800 font-medium">
              Gerencie suas reservas de livros
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-700">{enrichedReservations.length}</div>
            <div className="text-gray-800 text-sm font-semibold">Total de Reservas</div>
          </div>
        </div>
      </div>

      {/* Loading indicator for updates */}
      {isLoading && reservations.length > 0 && (        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
          <p className="text-blue-800 font-semibold">Atualizando lista de reservas...</p>
        </div>
      )}

      {/* Empty State */}
      {enrichedReservations.length === 0 && !isLoading ? (        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma reserva encontrada</h3>
          <p className="text-gray-800 mb-6 text-center max-w-md font-medium">
            Você ainda não possui reservas ativas. Que tal explorar nosso catálogo e reservar um livro?
          </p>
          <a
            href="/books"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span>🔍</span>
            Explorar Catálogo
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Reservations List */}
          {enrichedReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <ReservationListItem reservation={reservation} />
                  </div>
                  {reservation.status === 'ativa' && (                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="group px-4 py-2 bg-red-100 text-red-800 border-2 border-red-300 font-bold rounded-lg hover:bg-red-700 hover:text-white transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <span>❌</span>
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}          {/* Statistics Section */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-8 border-2 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Status das Reservas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-700">
                  {enrichedReservations.filter(r => r.status === 'ativa').length}
                </div>
                <div className="text-gray-800 text-sm font-semibold">Ativas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {enrichedReservations.filter(r => r.status === 'concluída').length}
                </div>
                <div className="text-gray-800 text-sm font-semibold">Concluídas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-700">
                  {enrichedReservations.filter(r => r.status === 'cancelada').length}
                </div>
                <div className="text-gray-800 text-sm font-semibold">Canceladas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-700">
                  {enrichedReservations.filter(r => r.status === 'expirada').length}
                </div>
                <div className="text-gray-800 text-sm font-semibold">Expiradas</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;
