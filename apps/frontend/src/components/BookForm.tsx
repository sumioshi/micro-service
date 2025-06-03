'use client'; // Required for components with event handlers / state

import React, { useState, useEffect } from 'react';
import { Book } from './BookCard'; // Re-use the Book type

// DTO for form data (subset of Book)
export interface BookFormData {
  titulo: string;
  autor: string;
}

interface BookFormProps {
  onSubmit: (data: BookFormData) => Promise<void>; // Make it async if needed
  initialData?: Book; // For editing
  isLoading?: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ onSubmit, initialData, isLoading = false }) => {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setAutor(initialData.autor);
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!titulo || !autor) {
      alert('Título and Autor are required.'); // Simple validation
      return;
    }
    onSubmit({ titulo, autor });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          name="titulo"
          id="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="autor" className="block text-sm font-medium text-gray-700">
          Autor
        </label>
        <input
          type="text"
          name="autor"
          id="autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isLoading ? 'Submitting...' : (initialData ? 'Update Book' : 'Add Book')}
        </button>
      </div>
    </form>
  );
};

export default BookForm;
