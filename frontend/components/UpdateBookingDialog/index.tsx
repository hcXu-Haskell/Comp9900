import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from "@mui/material";
import CarSpace, { AvailableType, UnavailableType } from "models/CarSpace";
import CustomerDatePicker from "components/CustomerDatePicker";
import PickedDatesAccordion from "components/PickedDatesAccordion";
import PriceTag from "components/PriceTag";

export interface UpdateBookingDialogProps {
  open: boolean;
  handleClose: () => void;
  startDate: Date | null;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
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
  handleUpdateBooking: () => void;
  bookedDays: Date[];
  totalPrice?: number;
}
const UpdateBookingDialog: React.FC<UpdateBookingDialogProps> = (props) => {
  const {
    open,
    handleClose,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
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
    handleUpdateBooking,
    bookedDays,
    totalPrice,
  } = props;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs'>
      <DialogTitle>Please select new booking date</DialogTitle>
      <DialogContent>
        <CustomerDatePicker
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          availableType={availableType}
          availableFromDate={availableFromDate}
          availableToDate={availableToDate}
          availableWeekDays={availableWeekDays}
          availableFromTime={availableFromTime}
          availableToTime={availableToTime}
          unavailableType={unavailableType}
          unavailableFromDate={unavailableFromDate}
          unavailableToDate={unavailableToDate}
          unavailableDates={unavailableDates}
          disabledFromDate={disabledFromDate}
          disabledToDate={disabledToDate}
        />
        {startDate &&
          endDate &&
          !disabledFromDate(startDate) &&
          !disabledToDate(endDate) &&
          totalPrice && (
            <>
              <PickedDatesAccordion dates={bookedDays} />
              <Box sx={{ mt: 1 }}>
                <Typography variant='h6' component='h3' align='center'>
                  Total Price
                </Typography>
                <PriceTag price={totalPrice} discount={0} />
              </Box>
            </>
          )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleUpdateBooking}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBookingDialog;
