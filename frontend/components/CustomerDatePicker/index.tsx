import { Dispatch, SetStateAction, useMemo } from "react";
// mui
import { Stack, TextField, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
// internal
import useApplicationContext from "hooks/useApplicationContext";
import { AvailableType, UnavailableType } from "models/CarSpace";

interface CustomerDatePickerProps {
  // from car space detail
  availableType: AvailableType;
  availableFromDate?: Date;
  availableToDate?: Date;
  availableWeekDays?: number[];
  availableFromTime?: Date;
  availableToTime?: Date;
  unavailableType: UnavailableType;
  unavailableFromDate?: Date;
  unavailableToDate?: Date;
  unavailableDates?: Date[];
  disabledFromDate: (day: Date) => boolean;
  disabledToDate: (day: Date) => boolean;
  // for form
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
}

const CustomerDatePicker: React.FC<CustomerDatePickerProps> = (props) => {
  const { token } = useApplicationContext();
  const isLoggedIn = !!token;
  const {
    availableType,
    availableFromDate,
    availableToDate,
    availableFromTime,
    availableToTime,
    availableWeekDays,
    unavailableType,
    unavailableDates,
    unavailableFromDate,
    unavailableToDate,
    disabledFromDate,
    disabledToDate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = props;

  const availableText = useMemo(() => {
    let text: string = "This car space is available ";
    if (availableType === AvailableType.ALWAYS) {
      // always available
      text += "24/7";
    } else {
      text += `from ${availableFromDate?.toLocaleDateString(
        "en-au"
      )} to ${availableToDate?.toLocaleDateString(
        "en-au"
      )} ${availableFromTime?.toLocaleTimeString("en-au", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${availableToTime?.toLocaleTimeString("en-au", {
        hour: "2-digit",
        minute: "2-digit",
      })} on ${availableWeekDays
        ?.map(
          (d) =>
            [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ][d]
        )
        .join(", ")}`;
    }
    text += " except ";
    if (
      unavailableType === UnavailableType.RANGE &&
      unavailableFromDate &&
      unavailableToDate
    ) {
      text += `from ${unavailableFromDate.toLocaleDateString(
        "en-au"
      )} to ${unavailableToDate.toLocaleDateString("en-au")}`;
    } else if (unavailableType === UnavailableType.PICKER && unavailableDates) {
      text += `${unavailableDates
        .map((d) => d.toLocaleDateString("en-au"))
        .join(", ")}`;
    }
    text += " and days marked gray in the calendar.";

    return text;
  }, [
    availableFromDate,
    availableFromTime,
    availableToDate,
    availableToTime,
    availableType,
    availableWeekDays,
    unavailableDates,
    unavailableFromDate,
    unavailableToDate,
    unavailableType,
  ]);

  return (
    <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
      <Typography sx={{ textAlign: "center", p: 2 }} variant='subtitle2'>
        {availableText}
      </Typography>
      {isLoggedIn && (
        <>
          <DatePicker
            label='from'
            inputFormat='dd/MM/yyyy'
            value={startDate}
            disablePast
            onChange={(newValue) => {
              setStartDate(newValue);
              setEndDate(null);
            }}
            renderDay={(day, _value, PickersDayProps) => (
              <PickersDay
                {...PickersDayProps}
                disabled={disabledFromDate(day)}
              />
            )}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label='to'
            inputFormat='dd/MM/yyyy'
            value={endDate}
            disablePast
            disabled={!startDate}
            onChange={(newValue) => {
              if (newValue) {
                setEndDate(newValue);
              }
            }}
            renderDay={(day, _value, PickersDayProps) => (
              <PickersDay {...PickersDayProps} disabled={disabledToDate(day)} />
            )}
            renderInput={(params) => <TextField {...params} />}
          />
        </>
      )}
    </Stack>
  );
};

export default CustomerDatePicker;
