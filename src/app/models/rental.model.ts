export interface Rental {
  id: number;
  carId: number;
  userId: string;
  startDate: string; // ISO date
  endDate: string;
}
