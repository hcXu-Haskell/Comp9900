import Wishlist from "./Wishlist";
import CarSpace from "./CarSpace";
import Comment from "./Comment";
import Vehicle from "./Vehicle";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;

  bank_account_name?: string;
  bank_account_number?: string;
  bank_account_bsb?: string;

  nearby_parking: boolean;
  rental_history: boolean;
  competitive: boolean;
  discount_rate: number | null;
  liked_car_spaces?: string;
  disliked_car_spaces?: string;

  first_timer: boolean;

  car_spaces?: CarSpace[];
  comments?: Comment[];
  vehicles?: Vehicle[];
  wishlist?: Wishlist[];

  created_at: string;
  updated_at: string;
}

export default User;
