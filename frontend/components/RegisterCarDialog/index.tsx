import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import { VehicleType } from "models/CarSpace";
import { AustraliaState } from "models/Vehicle";

export interface RegisterCarDialogProps {
  open: boolean;
  handleClose: () => void;
  plate: string;
  setPlate: Dispatch<SetStateAction<string>>;
  vehicleType: VehicleType;
  setVehicleType: Dispatch<SetStateAction<VehicleType>>;
  state: AustraliaState;
  setState: Dispatch<SetStateAction<AustraliaState>>;
  handleRegisterCar: () => void;
}
const RegisterCarDialog: React.FC<RegisterCarDialogProps> = (props) => {
  const {
    open,
    handleClose,
    plate,
    setPlate,
    vehicleType,
    setVehicleType,
    state,
    setState,
    handleRegisterCar,
  } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Register my car</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To register, please provide plate number, vehicle type and state.
        </DialogContentText>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <FormControl fullWidth required>
            <TextField
              autoFocus
              id='plate'
              variant='standard'
              label='Plate Number *'
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
            />
          </FormControl>
          <FormControl variant='standard' fullWidth required>
            <InputLabel id='vehicle-type-select-label'>Vehicle Type</InputLabel>
            <Select
              id='vehicle-type'
              name='vehicle_type'
              labelId='vehicle-type-select-label'
              variant='standard'
              value={vehicleType}
              onChange={(event) => {
                setVehicleType(event.target.value as VehicleType);
              }}
            >
              {(
                Object.keys(VehicleType) as Array<keyof typeof VehicleType>
              ).map((item, index) => (
                <MenuItem key={index} value={item}>
                  {VehicleType[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant='standard' fullWidth required>
            <InputLabel id='state-select-label'>State</InputLabel>
            <Select
              id='state'
              name='state'
              labelId='state-select-label'
              variant='standard'
              value={state}
              onChange={(event) => {
                setState(event.target.value as AustraliaState);
              }}
            >
              {(
                Object.keys(AustraliaState) as Array<
                  keyof typeof AustraliaState
                >
              ).map((item, index) => (
                <MenuItem key={index} value={item}>
                  {AustraliaState[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleRegisterCar}>Register</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterCarDialog;
