import { Button, Card, Stack, Typography } from "@mui/material";
import { VehicleType } from "models/CarSpace";
import Vehicle, { AustraliaState } from "models/Vehicle";

interface VehicleDetailCardProps {
  vehicle: Vehicle;
  handleDelete: (vehicle: Vehicle) => void;
}

const VehicleDetailCard: React.FC<VehicleDetailCardProps> = (props) => {
  const { vehicle, handleDelete } = props;

  return (
    <Card>
      <Stack direction='row' spacing={2} sx={{ m: 2 }}>
        <Stack flexGrow={1}>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Plate:</Typography>
            <Typography>{vehicle.plate}</Typography>
          </Stack>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Type:</Typography>
            <Typography>
              {VehicleType[vehicle.vehicle_type as keyof typeof VehicleType]}
            </Typography>
          </Stack>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>State:</Typography>
            <Typography>
              {
                AustraliaState[
                  vehicle.state as unknown as keyof typeof AustraliaState
                ]
              }
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          <Button onClick={() => handleDelete(vehicle)}>delete</Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default VehicleDetailCard;
