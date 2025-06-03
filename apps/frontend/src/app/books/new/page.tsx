'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // For redirecting after submit
import BookForm, { BookFormData } from '@/components/BookForm'; // Adjust path
import { useBookStore } from '@/store/bookStore'; // Adjust path

const NewBookPage = () => {
  const router = useRouter();
  const { addBook, isLoading, error } = useBookStore();

  const handleSubmit = async (data: BookFormData) => {
    const newBook = await addBook(data);
    if (newBook) {
      alert('Book added successfully!'); // Or use a toast notification
      router.push('/books'); // Redirect to the books list
    } else {
      // Error is handled by the store and can be displayed if needed
      // alert('Failed to add book: ' + error); // error from store might be stale here
      alert('Failed to add book. Please check console or try again.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Add a New Book</h1>
      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      <BookForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

export default NewBookPage;
