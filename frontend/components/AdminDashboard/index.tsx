import { useMemo } from "react";
// mui
import { Divider, Stack, Grid, Typography } from "@mui/material";
// internal
import Booking, { BookingStatus } from "models/Booking";
import CarSpace from "models/CarSpace";
import { getMoneyEarnedByPlatform } from "utils/utils";

interface AdminDashboardProps {
  carSpaces: CarSpace[];
  bookings: Booking[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
  const { carSpaces, bookings } = props;

  const moneyEarned = useMemo(
    () => getMoneyEarnedByPlatform(bookings).toFixed(2),
    [bookings]
  );

  return (
    <Stack spacing={2}>
      <Typography variant='h5'>Dashboard</Typography>
      <Grid container spacing={2} flexDirection='column' gap={2}>
        <Grid item xs>
          <Stack spacing={1}>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography variant='subtitle1'>A$</Typography>
              <Typography variant='h3'>{moneyEarned}</Typography>
            </Stack>
            <Typography>Money Earned</Typography>
          </Stack>
        </Grid>
        <Divider />
        <Grid item xs>
          <Stack spacing={1}>
            <Stack direction='row' spacing={2}>
              <Typography variant='h3'>{carSpaces.length}</Typography>
              <Stack direction='row' spacing={2}>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Typography>
                    {carSpaces.filter((cs) => cs.status === "online").length}
                  </Typography>
                  <Typography variant='caption'>online</Typography>
                </Stack>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Typography>
                    {carSpaces.filter((cs) => cs.status === "offline").length}
                  </Typography>
                  <Typography variant='caption'>offline</Typography>
                </Stack>
              </Stack>
            </Stack>

            <Typography>Car spaces</Typography>
          </Stack>
        </Grid>
        <Divider />
        <Grid item xs>
          <Stack spacing={1}>
            <Stack direction='row' spacing={2}>
              <Typography variant='h3'>{bookings.length}</Typography>
              <Stack direction='row' spacing={2}>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Typography>
                    {
                      bookings.filter(
                        (bk) => bk.status === BookingStatus.PENDING
                      ).length
                    }
                  </Typography>
                  <Typography variant='caption'>
                    {BookingStatus.PENDING}
                  </Typography>
                </Stack>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Typography>
                    {
                      bookings.filter(
                        (bk) => bk.status === BookingStatus.CANCELLED
                      ).length
                    }
                  </Typography>
                  <Typography variant='caption'>
                    {BookingStatus.CANCELLED}
                  </Typography>
                </Stack>
                <Stack alignItems='center' direction='row' spacing={1}>
                  <Typography>
                    {
                      bookings.filter((bk) => bk.status === BookingStatus.PAID)
                        .length
                    }
                  </Typography>
                  <Typography variant='caption'>
                    {BookingStatus.PAID}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Typography>Bookings</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default AdminDashboard;
