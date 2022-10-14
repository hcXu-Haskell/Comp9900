import { VehicleType, CarSpaceType, AccessType } from "models/CarSpace";

const carSpace = {
  id: 1,
  title: "car space title",
  bond: 1000.0,
  image:
    "https://d2syaugtnopsqd.cloudfront.net/wp-content/uploads/sites/10/2020/10/27135236/How-wide-is-a-parking-space-scaled.jpg",
  size_length: 5.4,
  size_width: 4.3,
  max_height: 2.1,
  max_allowed_vehicle: VehicleType.hatch,
  car_space_type: CarSpaceType.indoor,
  amenities: "CCTV,Charging",
  access_type: AccessType.key,
  created_at: "2022-06-26T01:00:00",
  updated_at: "2022-06-27T02:00:00",
  user_id: 1,
  price_per_day: 10.0,
  price_per_week: 65.0,
  price_per_month: 250.0,
  address_id: "1",
  address: "UNSW High Street",
  latitude: -33.917697,
  longitude: 151.231174,
  unavailable_type: 0, // 0 is range
  unavailable_dates: "",
  unavailable_from_date: "2022-07-01T14:00:00.000Z",
  unavailable_to_date: "2022-07-06T14:00:00.000Z",
  available_type: 0, // 0 is always
  available_from_time: "",
  available_to_time: "",
  available_from_date: "",
  available_to_date: "",
  available_week_days: "0,1,2,3,4,5,6",
  description: "test description",
  instructions: "test instruction",
  provider_id: 0,
};

export default carSpace;
