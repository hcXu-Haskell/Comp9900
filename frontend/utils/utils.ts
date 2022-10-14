import Booking, { BookingStatus } from "models/Booking";
import CarSpace from "models/CarSpace";
import User from "models/User";
import Vehicle from "models/Vehicle";
import Wishlist from "models/Wishlist";
import Comment from "models/Comment";
import { SERVICE_FEE_RATE } from "./constants";
import { isPast } from "date-fns";

export type ModelHasCreatedTime =
  | Booking
  | CarSpace
  | Comment
  | Vehicle
  | Wishlist
  | User;

export const getNextDate = (date: Date) => {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  return nextDay;
};

export const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const getUnavailableDates = (
  unavailableType: number,
  unavailableDates?: string,
  unavailableFromDate?: Date,
  unavailableToDate?: Date
) => {
  let uDates: Date[] = [];

  if (unavailableType === 0 && unavailableFromDate && unavailableToDate) {
    // is range
    uDates = getDaysArray(unavailableFromDate, unavailableToDate);
  } else if (unavailableDates) {
    uDates = unavailableDates.split(",").map((d) => new Date(d));
  }
  return uDates;
};

export const getDaysArray = (start: Date, end: Date) => {
  const arr = [];
  for (
    let date = new Date(start);
    date <= new Date(end);
    date.setDate(date.getDate() + 1)
  ) {
    arr.push(new Date(date));
  }
  return arr;
};

export const getBookedDays = (
  startDate: Date,
  endDate: Date,
  availableWeekDays: number[],
  unavailableDates: Date[]
) => {
  return getDaysArray(startDate, endDate).filter(
    (d) =>
      availableWeekDays.includes(d.getDay()) &&
      !isIncludeDate(unavailableDates, d)
  );
};

export const calcBookingPrice = (
  pricePerDay: number,
  pricePerWeek: number,
  pricePerMonth: number,
  totalDays?: Date[],
  startDate?: Date,
  endDate?: Date,
  availableWeekDays?: number[],
  unavailableDates?: Date[]
) => {
  let myTotalDays = [];
  if (startDate && endDate && availableWeekDays && unavailableDates) {
    myTotalDays = getBookedDays(
      startDate,
      endDate,
      availableWeekDays,
      unavailableDates
    );
  } else if (totalDays) {
    myTotalDays = totalDays;
  }

  const month = Math.floor(myTotalDays.length / 30);
  let remainder = myTotalDays.length % 30;
  const week = Math.floor(remainder / 7);
  remainder = remainder % 7;
  const day = remainder;
  return month * pricePerMonth + week * pricePerWeek + day * pricePerDay;
};

export const getDateAsDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const datesAreEqual = (dateA: Date, dateB: Date) =>
  getDateAsDay(dateA).getTime() === getDateAsDay(dateB).getTime();

export const isIncludeDate = (dates: Date[], date: Date) =>
  dates.find((d) => datesAreEqual(d, date)) !== undefined;

export const getMoneyEarnedByProvider = (bookings: Booking[]) =>
  bookings
    .filter((bk) => bk.status === BookingStatus.PAID)
    .reduce((acc, item) => acc + item.price * (1 - SERVICE_FEE_RATE), 0);

export const getMoneyEarnedByPlatform = (bookings: Booking[]) =>
  bookings
    .filter((bk) => bk.status === BookingStatus.PAID)
    .reduce((acc, item) => acc + item.price * SERVICE_FEE_RATE, 0);

export const createTimeSorter = (
  a: ModelHasCreatedTime,
  b: ModelHasCreatedTime
) => Date.parse(b.created_at) - Date.parse(a.created_at);

export const getDatesFromOtherBookings = (
  otherBookings: Pick<Booking, "id" | "picked_dates">[]
) =>
  Array.from(
    new Set(
      otherBookings.reduce(
        (acc, bk) =>
          acc.concat(bk.picked_dates.split(",").map((d) => new Date(d))),
        [] as Date[]
      )
    )
  );

export const getDiscountRate = (first_timer: boolean, discount_rate: number) =>
  first_timer && discount_rate ? discount_rate : 0;

export const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const myIsPast = (date: Date) => {
  const tomorrow = new Date(date.getTime());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isPast(tomorrow);
};
