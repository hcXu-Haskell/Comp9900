import { useState, useCallback } from "react";
// mui
import { Button, Stack, Typography } from "@mui/material";
// internal
import RegisterCarDialog from "components/RegisterCarDialog";
import VehicleDetailCard from "components/VehicleDetailCard";
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { VehicleType } from "models/CarSpace";
import Vehicle, { AustraliaState } from "models/Vehicle";
import { Method } from "axios";

const VehicleDetails: React.FC = () => {
  const { user, requestUser, reportMessage } = useApplicationContext();
  const [open, setDialogOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState<VehicleType>(
    "" as VehicleType
  );
  const [plate, setPlate] = useState<string>("");
  const [state, setState] = useState<AustraliaState>("" as AustraliaState);
  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setPlate("");
    setVehicleType("" as VehicleType);
    setState("" as AustraliaState);
  };

  const [setRequestRegisterCar] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      handleClose();
      requestUser();
    },
  });

  const [setRequestDeleteVehicle] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: requestUser,
  });
  const handleDelete = useCallback(
    (vehicle: Vehicle) => {
      setRequestDeleteVehicle({
        method: "delete" as Method,
        url: `/vehicles/${vehicle.id}`,
      });
    },
    [setRequestDeleteVehicle]
  );

  const handleRegisterCar = useCallback(() => {
    if (plate && vehicleType && state) {
      setRequestRegisterCar({
        method: "post" as Method,
        url: "/vehicles",
        data: {
          plate,
          vehicle_type: vehicleType,
          state,
        },
      });

      reportMessage(
        `You have successfully registered your ${vehicleType} ${plate} ${state}`,
        "success"
      );
    } else {
      reportMessage(
        "Please provide plate number, vehicle type and state.",
        "warning"
      );
    }
  }, [plate, reportMessage, setRequestRegisterCar, state, vehicleType]);

  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Vehicle Details</Typography>
      <Stack spacing={2}>
        {user?.vehicles?.map((v) => (
          <VehicleDetailCard
            key={v.id}
            vehicle={v}
            handleDelete={handleDelete}
          />
        ))}
      </Stack>
      <Button onClick={handleClickOpen}>Register new car</Button>
      <RegisterCarDialog
        open={open}
        handleClose={handleClose}
        plate={plate}
        setPlate={setPlate}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        state={state}
        setState={setState}
        handleRegisterCar={handleRegisterCar}
      />
    </Stack>
  );
};

export default VehicleDetails;
