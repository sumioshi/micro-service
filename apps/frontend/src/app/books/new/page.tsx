'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // For redirecting after submit
import BookForm, { BookFormData } from '@/components/BookForm'; // Adjust path
import { useBookStore } from '@/store/bookStore'; // Adjust path
import Link from 'next/link';

const NewBookPage = () => {
  const router = useRouter();
  const { addBook, isLoading, error } = useBookStore();

  const handleSubmit = async (data: BookFormData) => {
    const newBook = await addBook(data);
    if (newBook) {
      // Show success message - ideally use a toast library
      alert('✅ Livro adicionado com sucesso!');
      router.push('/books'); // Redirect to the books list
    } else {
      // Error is handled by the store and can be displayed if needed
      alert('❌ Falha ao adicionar livro. Verifique o console ou tente novamente.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/" className="hover:text-blue-600 transition-colors">🏠 Início</Link>
        <span>›</span>
        <Link href="/books" className="hover:text-blue-600 transition-colors">📚 Livros</Link>
        <span>›</span>
        <span className="text-gray-800 font-medium">Adicionar Novo Livro</span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800">Erro ao adicionar livro</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <BookForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <span>💡</span>
          Dicas para adicionar livros
        </h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Certifique-se de que o título está escrito corretamente</li>
          <li>• Inclua o nome completo do autor principal</li>
          <li>• Verifique se o livro já não está cadastrado no sistema</li>
          <li>• Todos os campos são obrigatórios</li>
        </ul>
      </div>
    </div>
  );
};

export default NewBookPage;
