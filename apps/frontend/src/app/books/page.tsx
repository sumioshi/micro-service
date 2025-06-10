'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useBookStore } from '@/store/bookStore'; // Adjust path
import BookCard from '@/components/BookCard'; // Adjust path

const BooksPage = () => {
  const { books, isLoading, error, fetchBooks } = useBookStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  if (isLoading && books.length === 0) {
    return (      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-800 text-lg font-semibold">Carregando catálogo de livros...</p>
      </div>
    );
  }

  if (error) {
    return (      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">😕</div>
        <p className="text-red-700 text-lg mb-4 font-semibold">Erro ao carregar livros: {error}</p>
        <button 
          onClick={() => fetchBooks()} 
          className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!books.length && !isLoading) {
    return (      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📚</div>
        <p className="text-gray-800 text-lg mb-6 font-semibold">Nenhum livro encontrado no catálogo.</p>
        <Link
          href="/books/new"
          className="px-6 py-3 bg-green-700 text-white font-bold rounded-lg shadow-md hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Adicionar Primeiro Livro
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              📚 Catálogo de Livros
            </h1>
            <p className="text-gray-800 font-medium">
              Explore nossa coleção de {books.length} livros disponíveis
            </p>
          </div>
          <Link
            href="/books/new"
            className="group px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            <span className="text-xl">➕</span>
            Adicionar Novo Livro
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Loading indicator for updates */}
      {isLoading && books.length > 0 && (        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
          <p className="text-blue-800 font-semibold">Atualizando lista de livros...</p>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Estatísticas da Biblioteca</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">{books.length}</div>
            <div className="text-gray-800 text-sm font-semibold">Total de Livros</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">
              {books.filter(book => book.status === 'disponível').length}
            </div>
            <div className="text-gray-800 text-sm font-semibold">Disponíveis</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {books.filter(book => book.status === 'reservado').length}
            </div>
            <div className="text-gray-800 text-sm font-semibold">Reservados</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">
              {books.filter(book => book.status === 'emprestado').length}
            </div>
            <div className="text-gray-800 text-sm font-semibold">Emprestados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
