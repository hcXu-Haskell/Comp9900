export enum TopCities {
  Sydney,
  Melbourne,
}

export const SydneyLocation = {
  latitude: -33.865,
  longitude: 151.21,
};

export const MelbourneLocation = {
  latitude: -37.81,
  longitude: 144.97,
};

export const WeekDays = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://47.74.84.31:4000"
    : "http://localhost:4000";

export const MAPBOX_TOKEN =
  "pk.eyJ1IjoibGlnaHRmb2N1cyIsImEiOiJjbDR0ZzU1dXowMTkxM2RwM3BoM205Y3ZhIn0.8C0OCPerrl5NRyjXS0HtoQ";

export const DRAWER_WIDTH_ON_MEDIUM = 450;
export const DRAWER_WIDTH_ON_SMALL = 300;

export const DEFAULT_DISTANCE_FILTER = 200;
export const PASSWORD_RULE =
  "Use 8 or more characters with a mix of letters, numbers & symbols";

export const SALT = "$2a$10$CwTycUXWue0Thq9StjUM0u";

export const SERVICE_FEE_RATE = 0.15;

export const PAYPAL_OPTIONS = {
  "client-id":
    "AZWqaJ4tG-wyP0hp4jrgQhi9Ra8s0RhXm_tSn2m_QiXJS_GtzWKHrOBQ3tFHLhPvyoA9HSZ1uyGQzGRt",
  currency: "AUD",
  intent: "capture",
};

export const SIZE_CONTROL_PROP = {
  step: 0.1,
  min: 0,
};
