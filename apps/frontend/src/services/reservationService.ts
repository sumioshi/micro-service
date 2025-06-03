import axios from 'axios';
import { Reservation } from '@/components/ReservationListItem'; // Adjust path

// DTO for creating reservation (ensure this matches backend DTO)
export interface CreateReservationData {
  bookId: string;
  userId: string;
  dataReserva: string; // "YYYY-MM-DD"
}

const API_URL = process.env.NEXT_PUBLIC_RESERVATION_SERVICE_URL || 'http://localhost:3002/reservations';

export const getReservationsByUserId = async (userId: string): Promise<Reservation[]> => {
  try {
    console.log(`[ReservationService] Fetching reservations for userId: ${userId} from API...`);
    const response = await axios.get<Reservation[]>(`${API_URL}/user/${userId}`);
    // The backend now directly returns reservations.
    // The 'bookTitle' enrichment will be handled by the component/store if needed,
    // possibly by fetching book details separately from the BookStore.
    return response.data;
  } catch (error) {
    console.error(`[ReservationService] Error fetching reservations for userId ${userId}:`, error);
    throw new Error(error instanceof axios.AxiosError ? error.message : `Failed to fetch reservations for user ${userId}`);
  }
};

export const createReservation = async (data: CreateReservationData): Promise<Reservation> => {
  try {
    console.log('[ReservationService] Creating reservation via API:', data);
    const response = await axios.post<Reservation>(API_URL, data);
    console.log('[ReservationService] Reservation created via API:', response.data);
    // The backend reservation-service now handles interaction with book-service for status updates.
    return response.data;
  } catch (error) {
    console.error('[ReservationService] Error creating reservation:', error);
    // It's useful to pass along specific error messages from the backend if available
    if (error instanceof axios.AxiosError && error.response?.data?.message) {
        throw new Error(`Failed to create reservation: ${error.response.data.message}`);
    }
    throw new Error(error instanceof axios.AxiosError ? error.message : 'Failed to create reservation');
  }
};

export const cancelReservation = async (reservationId: string): Promise<void> => {
  // The backend DELETE /reservations/:id should handle setting book status to 'disponível'
  // by calling book-service. The frontend just calls the delete endpoint.
  // NestJS DELETE typically returns 200 OK (if returning data) or 204 No Content.
  // Axios delete method resolves to an AxiosResponse object, response.data might be empty for 204.
  try {
    console.log(`[ReservationService] Cancelling reservation: ${reservationId} via API...`);
    await axios.delete(`${API_URL}/${reservationId}`);
    console.log(`[ReservationService] Reservation ${reservationId} cancelled via API.`);
    // No specific object is returned by the backend on successful DELETE (204 No Content)
    // So, the store will need to remove it from its local state.
  } catch (error) {
    console.error(`[ReservationService] Error cancelling reservation ${reservationId}:`, error);
    if (error instanceof axios.AxiosError && error.response?.data?.message) {
        throw new Error(`Failed to cancel reservation: ${error.response.data.message}`);
    }
    throw new Error(error instanceof axios.AxiosError ? error.message : `Failed to cancel reservation ${reservationId}`);
  }
};
