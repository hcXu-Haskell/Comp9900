import { VehicleType } from "./CarSpace";

export enum AustraliaState {
  NSW = "New South Wales",
  QLD = "Queensland",
  NT = "Northern Territory",
  WA = "Western Australia",
  SA = "South Australia",
  VIC = "Victoria",
  ACT = "Australian Capital Territory",
  TAS = "Tasmania",
}

interface Vehicle {
  id: number;

  plate: string;
  vehicle_type: VehicleType;
  state: AustraliaState;

  created_at: string;
  updated_at: string;
}

export default Vehicle;
