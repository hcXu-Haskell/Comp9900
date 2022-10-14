import React, { useState, useMemo, useEffect } from "react";
// next
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
// mui
import {
  Box,
  Button,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
  styled,
  TypographyProps,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import PaymentIcon from "@mui/icons-material/Payment";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import SettingsIcon from "@mui/icons-material/Settings";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PaidIcon from "@mui/icons-material/Paid";
import StarIcon from "@mui/icons-material/Star";
// internal
import TabPanel, { a11yProps } from "components/TabPanel";
import MainContainer from "components/MainContainer";
import UserDashboard from "components/UserDashboard";
import Booking from "models/Booking";
import CarSpace from "models/CarSpace";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import CarSpaceListItemDashboard from "components/CarSpaceListItemDashboard";
import BookingListItem from "components/BookingListItem";
import ContactDetails from "components/ContactDetails";
import BankingDetails from "components/BankingDetails";
import VehicleDetails from "components/VehicleDetails";
import Settings from "components/SystemSettings";
import Wishlist from "components/Wishlist";
import useApplicationContext from "hooks/useApplicationContext";
import { createTimeSorter } from "utils/utils";
import Bookmarks from "components/Bookmarks";
import PickedDatesDialog from "components/PickedDatesDialog";
// third-party
import { Method } from "axios";
import qs from "qs";

export enum BookmarkType {
  ALL,
  LIKED,
  DISLIKED,
  NONE,
}

export const EmptyMessage = styled(({ ...props }: TypographyProps) => (
  <Typography {...props} variant='caption'>
    {props.children}
  </Typography>
))`
  font-size: 1rem;
  text-align: center;
`;

const UserProfile: NextPage = () => {
  const { token, isFetchingUser, user, requestUser } = useApplicationContext();
  const theme = useTheme();
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  const { currentTag: _currentTag } = router.query;
  const [currentTag, setCurrentTag] = useState(0);
  const [tagReady, setTagReady] = useState(false);

  const [open, setDialogOpen] = useState(false);
  const [pickedDates, setPickedDates] = useState<Date[]>([]);
  const handleClickOpen = (pickedDatesString: string) => () => {
    setDialogOpen(true);
    setPickedDates(pickedDatesString.split(",").map((d) => new Date(d)));
  };
  const handleClose = () => {
    setDialogOpen(false);
  };

  useEffect(() => {
    if (!token) {
      router.push(`/login?jump=${encodeURIComponent(window.location.href)}`);
    }
  }, [router, token]);

  useEffect(() => {
    if (router.isReady) {
      if (_currentTag) {
        setCurrentTag(parseInt(_currentTag as string));
      } else {
        router.replace(
          {
            pathname: "/user-profile",
            query: {
              currentTag: 0,
            },
          },
          undefined,
          { shallow: true }
        );
      }
      setTagReady(true);
      if (!token) {
        router.push("/");
      }
    }
  }, [_currentTag, router, token]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTag(newValue);
    router.push(
      {
        pathname: "/user-profile",
        query: {
          currentTag: newValue,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const [, isFetchingCarSpaces, carSpaces, , requestCarSpaces] =
    useAuthedApiCall<CarSpace[]>({
      requestInfo: { method: "get" as Method, url: "/car-spaces" },
    });

  const [, isFetchingBookings, bookings] = useAuthedApiCall<Booking[]>({
    requestInfo: {
      method: "get" as Method,
      url: "/bookings",
    },
  });

  const [, isFetchingBookingsByProvider, bookingsByProvider] = useAuthedApiCall<
    Booking[]
  >({
    requestInfo: {
      method: "get" as Method,
      url: "/bookings/current-provider",
    },
  });

  const [setRequestChangeCarSpaceStatus] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: requestCarSpaces,
  });

  const [
    setRequestGetLikedDislikedCarSpaces,
    isFetchingLikedDislikedCarSpaces,
    likedAndDislikedCarSpaces,
  ] = useAuthedApiCall<CarSpace[]>({ requestInfo: {} as any });

  const [setRequestLikeDislikeCarSpace] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: requestUser,
  });

  useEffect(() => {
    let ids = [] as string[];
    if (user?.liked_car_spaces) {
      ids = ids.concat(user?.liked_car_spaces.split(","));
    }
    if (user?.disliked_car_spaces) {
      ids = ids.concat(user?.disliked_car_spaces.split(","));
    }
    if (ids.length > 0) {
      const q = qs.stringify({ ids: ids.join(",") });
      setRequestGetLikedDislikedCarSpaces({
        method: "get" as Method,
        url: `/car-spaces?${q}`,
      });
    }
  }, [
    setRequestGetLikedDislikedCarSpaces,
    user?.disliked_car_spaces,
    user?.liked_car_spaces,
  ]);

  const likedCarSpaces = useMemo(
    () =>
      likedAndDislikedCarSpaces?.filter((cs) =>
        (user?.liked_car_spaces?.split(",") ?? []).includes(String(cs.id))
      ) ?? [],
    [likedAndDislikedCarSpaces, user?.liked_car_spaces]
  );

  const dislikedCarSpaces = useMemo(
    () =>
      likedAndDislikedCarSpaces?.filter((cs) =>
        (user?.disliked_car_spaces?.split(",") ?? []).includes(String(cs.id))
      ) ?? [],
    [likedAndDislikedCarSpaces, user?.disliked_car_spaces]
  );

  const profileTabs = useMemo(
    () => [
      {
        icon: <DashboardIcon />,
        label: "Dashboard",
        render: () => (
          <UserDashboard
            carSpaces={carSpaces ?? []}
            bookings={bookings ?? []}
            bookingsByProvider={bookingsByProvider ?? []}
            handleClickOpen={handleClickOpen}
            setRequestChangeCarSpaceStatus={setRequestChangeCarSpaceStatus}
          />
        ),
      },
      {
        icon: <LocalParkingIcon />,
        label: "Car Spaces",
        render: () =>
          carSpaces && (
            <Stack spacing={2}>
              <Typography variant='h5'>Car Spaces</Typography>
              {carSpaces.length > 0 ? (
                carSpaces
                  .sort(createTimeSorter)
                  .map((cs) => (
                    <CarSpaceListItemDashboard
                      key={cs.id}
                      carSpace={cs}
                      setRequestChangeCarSpaceStatus={
                        setRequestChangeCarSpaceStatus
                      }
                    />
                  ))
              ) : (
                <Link href='/register-car-space'>
                  <Button>Register new car space</Button>
                </Link>
              )}
            </Stack>
          ),
      },
      {
        icon: <StarIcon />,
        label: "Bookmarks",
        render: () => (
          <Bookmarks
            likedCarSpaces={likedCarSpaces}
            dislikedCarSpaces={dislikedCarSpaces}
            setRequestLikeDislikeCarSpace={setRequestLikeDislikeCarSpace}
          />
        ),
      },
      {
        icon: <EventNoteIcon />,
        label: "Booking History",
        render: () =>
          bookings && (
            <Stack spacing={2}>
              <Typography variant='h5'>Booking History</Typography>
              {bookings.length > 0 ? (
                bookings
                  .sort(createTimeSorter)
                  .map((bk) => (
                    <BookingListItem
                      key={bk.id}
                      booking={bk}
                      showProvider
                      onClickPrice={handleClickOpen(bk.picked_dates)}
                    />
                  ))
              ) : (
                <Link href='/'>
                  <Button>Look for a car space you like</Button>
                </Link>
              )}
            </Stack>
          ),
      },
      {
        icon: <PaidIcon />,
        label: "Bookings to You",
        render: () =>
          bookingsByProvider && (
            <Stack spacing={2}>
              <Typography variant='h5'>Bookings To You</Typography>
              {bookingsByProvider.length > 0 ? (
                bookingsByProvider
                  .sort(createTimeSorter)
                  .map((bk) => (
                    <BookingListItem
                      key={bk.id}
                      booking={bk}
                      showCustomer
                      showViewBooking={false}
                      onClickPrice={handleClickOpen(bk.picked_dates)}
                    />
                  ))
              ) : (
                <EmptyMessage>No bookings made to you yet</EmptyMessage>
              )}
            </Stack>
          ),
      },
      {
        icon: <ContactPageIcon />,
        label: "Contact Details",
        render: () => <ContactDetails />,
      },
      {
        icon: <PaymentIcon />,
        label: "Banking Details",
        render: () => <BankingDetails />,
      },
      {
        icon: <DirectionsCarIcon />,
        label: "Vehicle Details",
        render: () => <VehicleDetails />,
      },
      {
        icon: <SettingsIcon />,
        label: "Settings",
        render: () => <Settings />,
      },
      {
        icon: <CardGiftcardIcon />,
        label: "Wishlist",
        render: () => <Wishlist />,
      },
    ],
    [
      bookings,
      bookingsByProvider,
      carSpaces,
      dislikedCarSpaces,
      likedCarSpaces,
      setRequestChangeCarSpaceStatus,
      setRequestLikeDislikeCarSpace,
    ]
  );

  const loading =
    isFetchingCarSpaces ||
    isFetchingBookings ||
    isFetchingBookingsByProvider ||
    isFetchingUser ||
    isFetchingLikedDislikedCarSpaces ||
    !tagReady;
  return (
    <>
      <Head>
        <title>User Profile - Where2Park</title>
        <meta name='description' content='Where2Park user profile' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer loading={loading}>
        <Box
          sx={{
            display: "flex",
            flexDirection: mdMatches ? "row" : "column",
          }}
        >
          <Tabs
            orientation={mdMatches ? "vertical" : "horizontal"}
            value={currentTag}
            onChange={handleChange}
            variant='scrollable'
            aria-label='User profile tabs'
            sx={{
              borderRight: mdMatches ? 1 : 0,
              borderBottom: mdMatches ? 0 : 1,
              borderColor: "divider",
              flexBasis: mdMatches ? 200 : undefined,
            }}
          >
            {profileTabs.map((tab, index) => (
              <Tab
                sx={{ justifyContent: "flex-start" }}
                key={tab.label}
                label={tab.label}
                iconPosition='start'
                icon={tab.icon}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          {profileTabs.map((tab, index) => (
            <TabPanel
              key={tab.label}
              value={currentTag}
              index={index}
              style={{ flexGrow: 1 }}
            >
              {tab.render()}
            </TabPanel>
          ))}
        </Box>
      </MainContainer>
      <PickedDatesDialog
        open={open}
        handleClose={handleClose}
        dates={pickedDates}
      />
    </>
  );
};

export default UserProfile;
