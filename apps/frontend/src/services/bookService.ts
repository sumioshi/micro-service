import axios from 'axios';
import { Book } from '@/components/BookCard'; // Adjust path as needed
import { BookFormData } from '@/components/BookForm'; // Adjust path as needed

const API_URL = process.env.NEXT_PUBLIC_BOOK_SERVICE_URL || 'http://localhost:3001/books';

export const getBooks = async (): Promise<Book[]> => {
  try {
    console.log('[BookService] Fetching all books from API...');
    const response = await axios.get<Book[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('[BookService] Error fetching books:', error);
    // Consider how to handle AxiosError vs other errors if needed
    throw new Error(error instanceof axios.AxiosError ? error.message : 'Failed to fetch books');
  }
};

export const getBookById = async (id: string): Promise<Book | undefined> => {
  try {
    console.log(`[BookService] Fetching book by ID: ${id} from API...`);
    const response = await axios.get<Book>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`[BookService] Error fetching book ${id}:`, error);
    if (error instanceof axios.AxiosError && error.response?.status === 404) {
      return undefined; // Or throw custom NotFoundError
    }
    throw new Error(error instanceof axios.AxiosError ? error.message : `Failed to fetch book ${id}`);
  }
};

export const createBook = async (data: BookFormData): Promise<Book> => {
  try {
    console.log('[BookService] Creating book via API:', data);
    // The backend book-service create method should set default status and generate ID
    const response = await axios.post<Book>(API_URL, data);
    console.log('[BookService] Book created via API:', response.data);
    return response.data;
  } catch (error) {
    console.error('[BookService] Error creating book:', error);
    throw new Error(error instanceof axios.AxiosError ? error.message : 'Failed to create book');
  }
};

// This function might not be directly called by the frontend anymore if status updates
// are side effects of other operations (e.g., reservations handled by backend services).
// If frontend needs to directly patch a book (e.g. its title/author, or status for admin reasons),
// a more generic updateBook function would be better.
// For now, this specific updateBookStatus is less likely to be used from client.
export const updateBookStatus = async (id: string, status: Book['status']): Promise<Book | undefined> => {
  try {
    console.log(`[BookService] Updating status for book ID ${id} to ${status} via API...`);
    const response = await axios.patch<Book>(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`[BookService] Error updating book status for ${id}:`, error);
    if (error instanceof axios.AxiosError && error.response?.status === 404) {
      return undefined;
    }
    throw new Error(error instanceof axios.AxiosError ? error.message : `Failed to update book status for ${id}`);
  }
};
