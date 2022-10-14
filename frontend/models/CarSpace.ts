import User from "./User";
import Comment from "./Comment";
import Booking from "./Booking";

export type PriceType = "Month" | "Week" | "Day";

export enum AmenityType {
  CCTV = "CCTV",
  Access = "24/7 Access",
  Arranged = "Arranged Transfers",
  WC = "WC",
  Security = "Security Gates",
  Lighting = "Lighting",
  Shelter = "Sheltered Parking",
  Underground = "Underground",
  Charging = "Electric Charging",
  Patrols = "Security Patrols",
  Wash = "Car Wash",
  Disabled = "Disabled Access",
}

export enum CarSpaceType {
  Indoor = "Indoor lot",
  Driveway = "Driveway",
  Undercover = "Undercover",
  Outside = "Outside",
  Carport = "Carport",
  Lockup = "Lock up garage",
  Other = "Other",
}

export enum AccessType {
  Key = "Key",
  Remote = "Remote",
  SwipeCard = "Swipe card",
  PassCode = "Passcode",
  Pay = "Pay and display",
  Gate = "Boom gate",
  Ticket = "Ticket",
  None = "None",
}

export enum VehicleType {
  Hatch = "Hatch",
  Sedan = "Sedan",
  Wagon = "Wagon",
  SUV = "SUV/4WD",
  Ute = "Ute",
  PeopleMover = "People Mover",
  Commercial = "Commercial",
  Bike = "Bike",
}

export enum AvailableType {
  ALWAYS,
  CUSTOM,
}

export enum UnavailableType {
  RANGE,
  PICKER,
}

interface CarSpace {
  id: number;
  title: string;
  image?: string;
  size_length: number;
  size_width: number;
  max_height?: number;
  max_allowed_vehicle: VehicleType;
  car_space_type: CarSpaceType;
  amenities?: string; // comma separated list of amenities
  access_type: AccessType;

  bond: number;
  price_per_day: number;
  price_per_week: number;
  price_per_month: number;

  address_id: string;
  address: string;
  latitude: number;
  longitude: number;

  distance?: number; // for list, dynamically calculated from backend

  unavailable_type: UnavailableType;
  unavailable_dates?: string;
  unavailable_from_date?: string;
  unavailable_to_date?: string;

  available_type: AvailableType;
  available_from_time?: string;
  available_to_time?: string;
  available_from_date?: string;
  available_to_date?: string;
  available_week_days?: string;

  description?: string;
  instructions?: string;
  status: "online" | "offline";

  created_at: string;
  updated_at: string;

  provider_id: number;
  provider: Pick<User, "name" | "discount_rate">;
  bookings?: Booking[];
  comments?: Comment[];
  bookings_to_same_car_space?: Pick<Booking, "id" | "picked_dates">[];
  booking_count: number;
  no_booking_past_six_months?: boolean;
}

export default CarSpace;
