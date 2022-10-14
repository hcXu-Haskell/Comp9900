import CarSpace from "./CarSpace";
import User from "./User";

export enum BookingStatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}

interface Booking {
  id: number;
  price: number;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  picked_dates: string;

  created_at: string;
  updated_at: string;

  user_id: number;
  car_space_id: number;
  car_space_snapshot: string;
  customer?: Pick<User, "name" | "discount_rate">;
  provider?: Pick<User, "name" | "discount_rate">;
  bookings_to_same_car_space?: Pick<Booking, "id" | "picked_dates">[];
}

export default Booking;
