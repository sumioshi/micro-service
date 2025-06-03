import { create } from 'zustand';
import { Reservation } from '@/components/ReservationListItem'; // Adjust path
import { CreateReservationData } from '@/services/reservationService'; // Adjust path
import {
  getReservationsByUserId,
  createReservation as apiCreateReservation,
  cancelReservation as apiCancelReservation
} from '@/services/reservationService'; // Adjust path

interface ReservationState {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  fetchReservations: (userId: string) => Promise<void>;
  addReservation: (data: CreateReservationData) => Promise<Reservation | undefined>;
  cancelExistingReservation: (reservationId: string) => Promise<void>;
}

// Need to import useBookStore to call its actions
import { useBookStore } from './bookStore'; // Adjust path if necessary

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  isLoading: false,
  error: null,

  fetchReservations: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const reservations = await getReservationsByUserId(userId);
      set({ reservations, isLoading: false });
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to fetch reservations';
      console.error('[ReservationStore] Error fetching reservations:', error);
      set({ isLoading: false, error });
    }
  },

  addReservation: async (data: CreateReservationData) => {
    set({ isLoading: true, error: null });
    try {
      const newReservation = await apiCreateReservation(data); // This mock already "updates" book status

      // Update local reservation state
      set((state) => ({
        reservations: [...state.reservations, newReservation],
        isLoading: false,
      }));

      // Trigger book status update in BookStore
      if (newReservation) {
        useBookStore.getState().setBookStatus(newReservation.bookId, 'reservado');
        console.log(`[ReservationStore] Called setBookStatus for bookId: ${newReservation.bookId}`);
      }
      return newReservation;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create reservation';
      console.error('[ReservationStore] Error creating reservation:', error);
      set({ isLoading: false, error });
      return undefined;
    }
  },

  cancelExistingReservation: async (reservationId: string) => {
    set({ isLoading: true, error: null });
    const currentReservations = get().reservations;
    const reservationToCancel = currentReservations.find(r => r.id === reservationId);

    if (!reservationToCancel) {
      set({ isLoading: false, error: "Reservation not found in local store." });
      return;
    }
    // Store bookId for updating bookStore later, as reservationToCancel will be removed
    const { bookId } = reservationToCancel;

    try {
      await apiCancelReservation(reservationId); // This is now Promise<void>

      // If API call is successful, update local state
      set((state) => ({
        reservations: state.reservations.filter(r => r.id !== reservationId),
        isLoading: false,
      }));

      // Trigger book status update in BookStore
      // Backend reservation service is responsible for calling book service to update status.
      // Frontend bookStore should reflect this change, possibly by re-fetching or via this explicit call if needed for UI immediacy.
      // Given the current setup, book-service would have updated the book.
      // Forcing a frontend state update in bookStore ensures UI consistency immediately.
      useBookStore.getState().setBookStatus(bookId, 'disponível');
      console.log(`[ReservationStore] Called setBookStatus for bookId: ${bookId} to disponível after cancellation.`);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel reservation';
      console.error('[ReservationStore] Error cancelling reservation:', errorMsg);
      set({ isLoading: false, error: errorMsg });
    }
  }
}));
