import { Dispatch, SetStateAction, useMemo } from "react";
import Link from "next/link";
// mui
import {
  Divider,
  Stack,
  Grid,
  Avatar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
// internal
import useApplicationContext from "hooks/useApplicationContext";
import Booking, { BookingStatus } from "models/Booking";
import CarSpace from "models/CarSpace";
import CarSpaceListItemDashboard from "components/CarSpaceListItemDashboard";
import BookingListItem from "components/BookingListItem";
import { IRequestInfo } from "hooks/useAuthedApiCall";
import { createTimeSorter, getMoneyEarnedByProvider } from "utils/utils";

interface UserDashboardProps {
  carSpaces: CarSpace[];
  bookings: Booking[];
  bookingsByProvider: Booking[];
  handleClickOpen: (pickedDates: string) => () => void;
  setRequestChangeCarSpaceStatus: Dispatch<SetStateAction<IRequestInfo>>;
}

const UserDashboard: React.FC<UserDashboardProps> = (props) => {
  const theme = useTheme();
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  const {
    carSpaces,
    bookings,
    bookingsByProvider,
    handleClickOpen,
    setRequestChangeCarSpaceStatus,
  } = props;
  const { user } = useApplicationContext();

  const moneyEarned = useMemo(
    () => getMoneyEarnedByProvider(bookingsByProvider).toFixed(2),
    [bookingsByProvider]
  );

  const currentBookings = bookings
    .filter(
      (bk) =>
        bk.status === BookingStatus.PENDING ||
        (bk.status === BookingStatus.PAID &&
          new Date(bk.end_date).getTime() < new Date().getTime())
    )
    .sort(createTimeSorter);

  return (
    <Stack spacing={2}>
      <Typography variant={mdMatches ? "h4" : "h5"}>
        Hello, <b>{user?.name}</b>
      </Typography>
      <Grid container spacing={2} flexDirection={mdMatches ? "row" : "column"}>
        <Grid
          item
          xs={12}
          md={5}
          container
          flexDirection='row'
          flexWrap='nowrap'
          gap={2}
          justifyContent={mdMatches ? "space-between" : "flex-start"}
          alignItems={mdMatches ? "flex-start" : "center"}
          sx={{ p: 2 }}
        >
          <Avatar
            sx={
              mdMatches ? { width: 72, height: 72 } : { width: 56, height: 56 }
            }
          />
          <Stack>
            <Stack direction='row' spacing={2} alignItems='center'>
              <Typography variant='subtitle1'>A$</Typography>
              <Typography variant='h3'>{moneyEarned}</Typography>
            </Stack>
            <Typography>
              {`Earned Since ${new Date(
                user?.created_at || Date.now()
              ).toLocaleDateString("en-au")}`}
            </Typography>
          </Stack>
        </Grid>
        <Divider
          orientation='vertical'
          flexItem
          sx={{ display: { xs: "none", md: "block" } }}
        />
        <Divider sx={{ display: { xs: "block", md: "none" } }} />
        <Grid item xs>
          <Stack spacing={1}>
            <Stack direction='row' spacing={2}>
              <Typography variant='h3'>{carSpaces.length}</Typography>
              <Stack
                direction={mdMatches ? "column" : "row"}
                spacing={mdMatches ? 0 : 2}
              >
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
            <Stack
              direction={mdMatches ? "column" : "row"}
              spacing={mdMatches ? 0 : 2}
              alignItems={mdMatches ? "flex-start" : "center"}
            >
              <Typography>Car spaces</Typography>
              <Link href='/register-car-space' passHref>
                <Button
                  sx={{ pl: 0, justifyContent: "flex-start" }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Grid>
        <Divider sx={{ display: { xs: "block", md: "none" } }} />
        <Grid item xs>
          <Stack spacing={1}>
            <Stack direction='row' spacing={2}>
              <Typography variant='h3'>{bookings.length}</Typography>
              <Stack
                direction={mdMatches ? "column" : "row"}
                spacing={mdMatches ? 0 : 2}
              >
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
            <Stack
              direction={mdMatches ? "column" : "row"}
              spacing={mdMatches ? 0 : 2}
              alignItems={mdMatches ? "flex-start" : "center"}
            >
              <Typography>Bookings</Typography>
              <Link href='/' passHref>
                <Button
                  sx={{ pl: 0, justifyContent: "flex-start" }}
                  endIcon={<AddIcon />}
                >
                  Add
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
      <Divider />
      <Typography variant='h5'>Car Spaces</Typography>
      <Stack spacing={2}>
        {carSpaces.filter((cs) => cs.status === "online").length === 0 ? (
          <Typography
            variant='caption'
            sx={{ fontSize: "1.2rem", textAlign: "center" }}
          >
            {"You have no active car space"}
          </Typography>
        ) : (
          carSpaces
            .filter((cs) => cs.status === "online")
            .sort(createTimeSorter)
            .slice(0, 3)
            .map((cs) => (
              <CarSpaceListItemDashboard
                key={cs.id}
                carSpace={cs}
                setRequestChangeCarSpaceStatus={setRequestChangeCarSpaceStatus}
              />
            ))
        )}
        <Link href='/user-profile?currentTag=1'>
          <Button>Review all registered car spaces</Button>
        </Link>
      </Stack>
      <Divider />
      <Typography variant='h5'>Bookings</Typography>
      <Stack spacing={2}>
        {currentBookings.length === 0 ? (
          <Typography
            variant='caption'
            sx={{ fontSize: "1.2rem", textAlign: "center" }}
          >
            {"You have no pending or current booking"}
          </Typography>
        ) : (
          currentBookings.map((bk) => (
            <BookingListItem
              key={bk.id}
              booking={bk}
              onClickPrice={handleClickOpen(bk.picked_dates)}
            />
          ))
        )}
        <Link href='/user-profile?currentTag=3'>
          <Button>Review all bookings</Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default UserDashboard;
