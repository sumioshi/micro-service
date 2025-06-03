import { create } from 'zustand';
import { Book } from '@/components/BookCard'; // Adjust path
import { BookFormData } from '@/components/BookForm'; // Adjust path
import { getBooks, getBookById, createBook as apiCreateBook } from '@/services/bookService'; // Adjust path

interface BookState {
  books: Book[];
  selectedBook: Book | null | undefined; // undefined for not found, null for not selected yet
  isLoading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  addBook: (data: BookFormData) => Promise<Book | undefined>;
  setBookStatus: (bookId: string, status: Book['status']) => void; // New action
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async () => {
    set({ isLoading: true, error: null });
    try {
      const books = await getBooks();
      set({ books, isLoading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch books';
      console.error('[BookStore] Error fetching books:', error);
      set({ isLoading: false, error });
    }
  },

  fetchBookById: async (id: string) => {
    set({ isLoading: true, error: null, selectedBook: null });
    try {
      // Simulate fetching from a service that has the most up-to-date data
      const book = await getBookById(id);
      set({ selectedBook: book, isLoading: false });
      if (!book) {
        console.warn(`[BookStore] Book with id ${id} not found during fetch.`);
      } else {
        // Ensure local list is also updated if this book's status changed
        // This is more relevant if getBookById could return fresher data than the list
        set(state => ({
          books: state.books.map(b => b.id === id ? book : b)
        }));
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : `Failed to fetch book ${id}`;
      console.error('[BookStore] Error fetching book by ID:', error);
      set({ isLoading: false, error });
    }
  },

  addBook: async (data: BookFormData) => {
    set({ isLoading: true, error: null });
    try {
      const newBook = await apiCreateBook(data);
      set((state) => ({
        books: [...state.books, newBook],
        isLoading: false,
      }));
      return newBook;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create book';
      console.error('[BookStore] Error creating book:', error);
      set({ isLoading: false, error });
      return undefined;
    }
  },

  setBookStatus: (bookId: string, status: Book['status']) => {
    set((state) => {
      const updatedBooks = state.books.map((book) =>
        book.id === bookId ? { ...book, status } : book,
      );
      const updatedSelectedBook =
        state.selectedBook?.id === bookId
          ? { ...state.selectedBook, status }
          : state.selectedBook;

      // Log for debugging the status update
      console.log(`[BookStore] setBookStatus called for bookId: ${bookId}, new status: ${status}`);
      if (state.selectedBook?.id === bookId) {
        console.log(`[BookStore] Updating selectedBook status.`);
      }
      if (!updatedBooks.find(b => b.id === bookId && b.status === status)) {
        console.warn(`[BookStore] Book ${bookId} not found in list or status not updated.`);
      }


      return {
        books: updatedBooks,
        selectedBook: updatedSelectedBook,
      };
    });
  }
}));
