import { useEffect, useMemo, useState, useCallback } from "react";
// next
import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
// mui
import {
  Stack,
  Typography,
  Box,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
//internal
import BookingListItem from "components/BookingListItem";
import MainContainer from "components/MainContainer";
import AdminNav from "components/AdminNav";
import AdminUserCard from "components/AdminUserCard";
import AdminDashboard from "components/AdminDashboard";
import TabPanel, { a11yProps } from "components/TabPanel";
import CarSpaceListItemDashboard from "components/CarSpaceListItemDashboard";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import Booking from "models/Booking";
import CarSpace from "models/CarSpace";
import User from "models/User";
import { createTimeSorter } from "utils/utils";
import useApplicationContext from "hooks/useApplicationContext";
import PickedDatesDialog from "components/PickedDatesDialog";
// third-party
import { Method } from "axios";

const Admin: NextPage = () => {
  const { reportMessage } = useApplicationContext();
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

  // get admin token

  const [adminToken, setAdminToken] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAdminToken(localStorage.getItem("adminToken") || "");
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      router.push("/admin/login");
    }
  }, [adminToken, router]);

  useEffect(() => {
    if (router.isReady) {
      if (_currentTag) {
        setCurrentTag(parseInt(_currentTag as string));
      } else {
        router.replace(
          {
            pathname: "/admin",
            query: {
              currentTag: 0,
            },
          },
          undefined,
          { shallow: true }
        );
      }
      setTagReady(true);
    }
  }, [_currentTag, router]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTag(newValue);
    router.push(
      {
        pathname: "/admin",
        query: {
          currentTag: newValue,
        },
      },
      undefined,
      { shallow: true }
    );
  };
  const [setRequestCarSpaces, isFetchingCarSpaces, carSpaces] =
    useAuthedApiCall<CarSpace[]>({
      requestInfo: {} as any,
      adminToken,
    });

  useEffect(() => {
    if (adminToken) {
      setRequestCarSpaces({
        method: "get" as Method,
        url: "/admin/car-spaces",
      });
    }
  }, [adminToken, setRequestCarSpaces]);

  const [setRequestBookings, isFetchingBookings, bookings] = useAuthedApiCall<
    Booking[]
  >({
    requestInfo: {} as any,
    adminToken,
  });

  useEffect(() => {
    if (adminToken) {
      setRequestBookings({
        method: "get" as Method,
        url: "/admin/bookings",
      });
    }
  }, [adminToken, setRequestBookings]);

  const [setRequestGetUsers, isFetchingUsers, users] = useAuthedApiCall<User[]>(
    { requestInfo: {} as any, adminToken }
  );
  useEffect(() => {
    if (adminToken) {
      setRequestGetUsers({ method: "get" as Method, url: "/admin/users" });
    }
  }, [adminToken, setRequestGetUsers]);

  const [setRequestDeleteUser] = useAuthedApiCall({
    requestInfo: {} as any,
    adminToken,
    callbackAfter: () => {
      setRequestGetUsers({ method: "get" as Method, url: "/admin/users" });
    },
  });
  const handleDeleteUser = useCallback(
    (user: User) => {
      if (adminToken) {
        setRequestDeleteUser({
          method: "delete" as Method,
          url: `/admin/users/${user.id}`,
        });
      }
    },
    [adminToken, setRequestDeleteUser]
  );

  const [setRequestSendStatement] = useAuthedApiCall<{ send_to_user: string }>({
    requestInfo: {} as any,
    adminToken,
    callbackAfter: (data) => {
      reportMessage(
        `You have sent the statement to ${data.send_to_user}`,
        "success"
      );
    },
  });

  const sendStatement = useCallback(
    (user: User) => {
      if (adminToken) {
        setRequestSendStatement({
          method: "post" as Method,
          url: `/admin/statements/${user.id}`,
        });
      }
    },
    [adminToken, setRequestSendStatement]
  );

  const [setRequestDeleteCarSpace] = useAuthedApiCall({
    requestInfo: {} as any,
    adminToken,
    callbackAfter: () => {
      setRequestCarSpaces({
        method: "get" as Method,
        url: "/admin/car-spaces",
      });
    },
  });
  const handleDeleteCarSpace = useCallback(
    (cs: CarSpace) => {
      if (adminToken) {
        setRequestDeleteCarSpace({
          method: "delete" as Method,
          url: `/admin/car-spaces/${cs.id}`,
        });
      }
    },
    [adminToken, setRequestDeleteCarSpace]
  );

  const [setRequestDeleteBooking] = useAuthedApiCall({
    requestInfo: {} as any,
    adminToken,
    callbackAfter: () => {
      setRequestBookings({
        method: "get" as Method,
        url: "/admin/bookings",
      });
    },
  });
  const handleDeleteBooking = useCallback(
    (bk: Booking) => {
      if (adminToken) {
        setRequestDeleteBooking({
          method: "delete" as Method,
          url: `/admin/bookings/${bk.id}`,
        });
      }
    },
    [adminToken, setRequestDeleteBooking]
  );

  const profileTabs = useMemo(
    () => [
      {
        icon: <DashboardIcon />,
        label: "Dashboard",
        render: () => (
          <AdminDashboard
            carSpaces={carSpaces || []}
            bookings={bookings || []}
          />
        ),
      },
      {
        icon: <PersonIcon />,
        label: "Users",
        render: () =>
          users && (
            <Stack spacing={2}>
              <Typography variant='h5'>Users</Typography>
              {users.length > 0 ? (
                users
                  .sort(createTimeSorter)
                  .map((user) => (
                    <AdminUserCard
                      key={user.id}
                      user={user}
                      handleDelete={handleDeleteUser}
                      sendStatement={sendStatement}
                    />
                  ))
              ) : (
                <Typography>No user in the database</Typography>
              )}
            </Stack>
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
                      handleDelete={handleDeleteCarSpace}
                      isAdmin={true}
                    />
                  ))
              ) : (
                <Typography>No car space in the database</Typography>
              )}
            </Stack>
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
                      isAdmin={true}
                      key={bk.id}
                      booking={bk}
                      handleDelete={handleDeleteBooking}
                      showCustomer
                      showProvider
                      showViewBooking={false}
                      onClickPrice={handleClickOpen(bk.picked_dates)}
                    />
                  ))
              ) : (
                <Typography>No booking in the database</Typography>
              )}
            </Stack>
          ),
      },
    ],
    [
      bookings,
      carSpaces,
      handleDeleteBooking,
      handleDeleteCarSpace,
      handleDeleteUser,
      sendStatement,
      users,
    ]
  );

  const loading =
    isFetchingBookings || isFetchingCarSpaces || isFetchingUsers || !tagReady;

  return (
    <>
      <Head>
        <title>Admin Dashboard - Where2Park</title>
        <meta name='description' content='Where2Park Admin Dashboard' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer
        loading={loading}
        MyNav={() => (
          <AdminNav adminToken={adminToken} setAdminToken={setAdminToken} />
        )}
      >
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
              flex: mdMatches ? "200px 0 0" : undefined,
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

export default Admin;
