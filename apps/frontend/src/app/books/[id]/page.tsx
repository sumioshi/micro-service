'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // For accessing route params
import Link from 'next/link';
import { useBookStore } from '@/store/bookStore'; // Adjust path
import { useReservationStore } from '@/store/reservationStore'; // Adjust path

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

const BookDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    selectedBook,
    isLoading: bookLoading,
    error: bookError,
    fetchBookById,
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
      alert('❌ Este livro não pode ser reservado no momento.');
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
      alert(`✅ Livro "${selectedBook.titulo}" reservado com sucesso! ID da reserva: ${newReservation.id}`);
      router.push('/reservations');
    } else {
      alert(`❌ Falha ao reservar livro: ${reservationError || 'Erro desconhecido'}`);
    }
  };

  // Loading state
  if (bookLoading && !selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-900 text-lg font-semibold">Carregando detalhes do livro...</p>
      </div>
    );
  }

  // Error state
  if (bookError && !selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">😕</div>        <p className="text-red-700 text-lg mb-4 font-semibold">Erro ao carregar livro: {bookError}</p>
        <button 
          onClick={() => fetchBookById(id)} 
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Not found state
  if (!selectedBook) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📚</div>        <h2 className="text-2xl font-bold text-gray-900 mb-2">Livro não encontrado</h2>
        <p className="text-gray-800 mb-6 font-medium">O livro que você procura não existe ou foi removido.</p>
        <Link
          href="/books"
          className="px-6 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-800 transition-colors"
        >
          Voltar ao Catálogo
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(selectedBook.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
        <Link href="/" className="hover:text-blue-700 transition-colors">🏠 Início</Link>
        <span>›</span>
        <Link href="/books" className="hover:text-blue-700 transition-colors">📚 Livros</Link>
        <span>›</span>
        <span className="text-gray-900 font-bold truncate">{selectedBook.titulo}</span>
      </div>      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 overflow-hidden">
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl">📖</div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedBook.titulo}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">✍️</span>
                    <p className="text-xl font-medium">{selectedBook.autor}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color} flex items-center gap-2`}>
                <span className="text-lg">{statusInfo.icon}</span>
                {statusInfo.text}
              </span>
            </div>
          </div>

          {/* Book Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📋 Informações do Livro</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">ID do Livro</span>
                <p className="font-mono text-sm bg-white px-3 py-2 rounded border">{selectedBook.id}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status Atual</span>
                <p className={`font-medium ${statusInfo.color}`}>{statusInfo.text}</p>
              </div>
            </div>
          </div>

          {/* Reservation Error */}
          {reservationError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">Erro na Reserva</h3>
                <p className="text-red-600">{reservationError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReserveBook}
              disabled={reservationLoading || selectedBook.status !== 'disponível'}
              className="flex-1 group px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {reservationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Reservando...
                </>
              ) : selectedBook.status === 'disponível' ? (
                <>
                  <span className="text-xl">📋</span>
                  Reservar Este Livro
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span className="text-xl">🚫</span>
                  Não Disponível para Reserva
                </>
              )}
            </button>

            <Link
              href="/books"
              className="px-6 py-4 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Catálogo
            </Link>
          </div>

          {/* Availability Info */}
          {selectedBook.status === 'disponível' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">Livro Disponível</h3>
                  <p className="text-green-700 text-sm">
                    Este livro está disponível para reserva. Clique no botão acima para reservá-lo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedBook.status !== 'disponível' && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h3 className="font-semibold text-yellow-800">Livro Indisponível</h3>
                  <p className="text-yellow-700 text-sm">
                    Este livro está atualmente {selectedBook.status.toLowerCase()} e não pode ser reservado no momento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
