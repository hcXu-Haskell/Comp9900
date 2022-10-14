import { CarSpaceType, PriceType, VehicleType } from "./CarSpace";
import User from "./User";

interface Wishlist {
  id: number;
  min_price: number;
  max_price: number;
  price_type: PriceType;

  address_id: string;
  address: string;
  latitude: number;
  longitude: number;

  distance: number;

  car_space_types: string;

  max_allowed_vehicle: VehicleType;

  customer_id: number;

  customer?: User;

  created_at: string;
  updated_at: string;
}

export type CreateWishlistItemFormData = Omit<
  Wishlist,
  "id" | "customer_id" | "customer" | "created_at" | "updated_at"
>;

export default Wishlist;
