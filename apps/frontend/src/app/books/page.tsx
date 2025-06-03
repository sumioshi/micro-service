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

  if (isLoading && books.length === 0) return <p className="text-center text-gray-500">Loading books...</p>;
  if (error) return <p className="text-center text-red-500">Error loading books: {error}</p>;
  if (!books.length && !isLoading) return <p className="text-center text-gray-500">No books found.</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Books</h1>
        <Link
          href="/books/new"
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
        >
          Add New Book
        </Link>
      </div>

      {isLoading && <p className="text-center text-gray-500 mb-4">Updating book list...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BooksPage;
