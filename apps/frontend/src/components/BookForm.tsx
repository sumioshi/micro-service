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
  const [errors, setErrors] = useState<{titulo?: string; autor?: string}>({});

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo);
      setAutor(initialData.autor);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: {titulo?: string; autor?: string} = {};
    
    if (!titulo.trim()) {
      newErrors.titulo = 'O título é obrigatório';
    } else if (titulo.length < 2) {
      newErrors.titulo = 'O título deve ter pelo menos 2 caracteres';
    }
    
    if (!autor.trim()) {
      newErrors.autor = 'O autor é obrigatório';
    } else if (autor.length < 2) {
      newErrors.autor = 'O nome do autor deve ter pelo menos 2 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit({ titulo: titulo.trim(), autor: autor.trim() });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-300 p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {initialData ? 'Editar Livro' : 'Adicionar Novo Livro'}
          </h2>
          <p className="text-gray-800 font-medium">
            {initialData ? 'Atualize as informações do livro' : 'Preencha os dados do novo livro'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">          <div>
            <label htmlFor="titulo" className="block text-sm font-bold text-gray-900 mb-2">
              📚 Título do Livro
            </label>
            <input
              type="text"
              name="titulo"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${
                errors.titulo ? 'border-red-400 bg-red-50' : 'border-gray-400 hover:border-gray-500'
              }`}
              placeholder="Digite o título do livro..."
              required
            />
            {errors.titulo && (
              <p className="mt-2 text-sm text-red-700 flex items-center gap-1 font-semibold">
                <span>⚠️</span>
                {errors.titulo}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="autor" className="block text-sm font-bold text-gray-900 mb-2">
              ✍️ Autor
            </label>
            <input
              type="text"
              name="autor"
              id="autor"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200 ${
                errors.autor ? 'border-red-400 bg-red-50' : 'border-gray-400 hover:border-gray-500'
              }`}
              placeholder="Digite o nome do autor..."
              required
            />
            {errors.autor && (
              <p className="mt-2 text-sm text-red-700 flex items-center gap-1 font-semibold">
                <span>⚠️</span>
                {errors.autor}
              </p>
            )}
          </div>          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 py-3 px-6 border-2 border-gray-400 text-gray-800 font-bold rounded-xl hover:bg-gray-100 transition-colors duration-200"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-700 to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <span>{initialData ? '✏️' : '➕'}</span>
                  {initialData ? 'Atualizar Livro' : 'Adicionar Livro'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
