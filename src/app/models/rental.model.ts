export interface Rental {
  id: string;
  carId: number;
  userId: string;
  startDate: string; // ISO date
  endDate: string;
  createdAt: string;
}
