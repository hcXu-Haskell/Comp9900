import { useState, useEffect, useMemo, useCallback } from "react";
// next
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
// mui
import {
  Paper,
  Grid,
  Typography,
  Rating,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
  Stack,
} from "@mui/material";
// internal
import {
  calcBookingPrice,
  getBookedDays,
  getDatesFromOtherBookings,
  getDaysArray,
  getUnavailableDates,
  isIncludeDate,
  isValidDate,
  myIsPast,
} from "utils/utils";
import CountdownChip from "components/CountdownChip";
import MapView from "components/MapView";
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import Booking, { BookingStatus } from "models/Booking";
import MainContainer from "components/MainContainer";
import UpdateBookingDialog from "components/UpdateBookingDialog";
import CarSpaceImage from "components/CarSpaceImage";
import ReportDialog from "components/ReportDialog";
import PriceTag from "components/PriceTag";
import PickedDatesAccordion from "components/PickedDatesAccordion";
import CarSpace, { AvailableType, UnavailableType } from "models/CarSpace";
// third-party
import "mapbox-gl/dist/mapbox-gl.css";
import { Method } from "axios";
import Countdown from "react-countdown";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { getDay, isPast } from "date-fns";
import _ from "lodash";

const BookingDetail: NextPage = () => {
  const { token, user, reportMessage } = useApplicationContext();
  const router = useRouter();
  const { id } = router.query;
  // comment states
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  // update booking customer date picker states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // if not login, redirect user to login page
  useEffect(() => {
    if (!token) {
      router.push(`/login?jump=${encodeURIComponent(window.location.href)}`);
    }
  }, [router, token]);

  const [setRequestCreateReview] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      requestBooking();
      setRating(5);
      setContent("");
      reportMessage("Thank you for leaving a comment!", "success");
    },
  });

  const [setRequestBooking, isFetchingBooking, booking, , requestBooking] =
    useAuthedApiCall<Booking>({
      requestInfo: {} as any,
    });

  const carSpace = useMemo(
    () => JSON.parse(booking?.car_space_snapshot ?? "{}"),
    [booking?.car_space_snapshot]
  ) as CarSpace;

  useEffect(() => {
    if (!_.isEmpty(carSpace))
      reportMessage(
        `You are viewing a snapshot of this car space last updated at ${new Intl.DateTimeFormat(
          "en",
          { dateStyle: "short", timeStyle: "medium" }
        ).format(new Date(carSpace.updated_at))}`,
        "info"
      );
  }, [carSpace, carSpace.updated_at, reportMessage]);

  const [setRequestPayBooking] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      requestBooking();
      reportMessage(
        "You have successfully complete the payment process.",
        "success"
      );
    },
  });

  const handlePayBooking = useCallback(() => {
    setRequestPayBooking({
      method: "put" as Method,
      url: `/bookings/${id}/commit`,
    });
  }, [id, setRequestPayBooking]);

  useEffect(() => {
    if (id && typeof id === "string") {
      setRequestBooking({
        method: "get" as Method,
        url: `/bookings/${id}`,
      });
    }
  }, [id, setRequestBooking]);

  const [setRequestCancel] = useAuthedApiCall<any>({
    requestInfo: {} as any,
    callbackAfter: () => {
      requestBooking();
      reportMessage(`You have successfully cancel booking ${id}`, "success");
    },
  });

  const handleCancel = useCallback(() => {
    setRequestCancel({
      method: "put" as Method,
      url: `bookings/${id}/cancel`,
    });
  }, [id, setRequestCancel]);

  const bookedDays = useMemo(() => {
    if (startDate && endDate && booking && carSpace) {
      return getBookedDays(
        startDate,
        endDate,
        carSpace.available_week_days?.split(",").map((d) => Number(d)) || [
          0, 1, 2, 3, 4, 5, 6,
        ],
        getUnavailableDates(
          carSpace.unavailable_type,
          carSpace.unavailable_dates,
          carSpace.unavailable_from_date
            ? new Date(carSpace.unavailable_from_date)
            : undefined,
          carSpace.unavailable_to_date
            ? new Date(carSpace.unavailable_to_date)
            : undefined
        )
      ).sort((a, b) => a.getTime() - b.getTime());
    }
    return [];
  }, [booking, carSpace, endDate, startDate]);

  const getTotalPrice = useCallback(() => {
    if (booking && carSpace) {
      let totalPrice = calcBookingPrice(
        carSpace.price_per_day,
        carSpace.price_per_week,
        carSpace.price_per_month,
        bookedDays
      );
      if (user?.first_timer && booking.provider?.discount_rate) {
        totalPrice *= 1 - booking.provider?.discount_rate / 100;
      }
      return Math.round(totalPrice * 100) / 100;
    }
  }, [bookedDays, booking, carSpace, user?.first_timer]);

  const [setRequestUpdate] = useAuthedApiCall<any>({
    requestInfo: {} as any,
    callbackAfter: () => {
      setUpdateModal(false);
      setReportModal(false);
      setStartDate(null);
      setEndDate(null);
      requestBooking();
    },
  });

  const [updateModal, setUpdateModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  const openUpdate = () => setUpdateModal(true);
  const openReport = () => setReportModal(true);

  const handleClose = () => {
    setUpdateModal(false);
    setReportModal(false);
    setStartDate(null);
    setEndDate(null);
  };

  const availableFromDate = carSpace?.available_from_date
    ? new Date(carSpace.available_from_date)
    : undefined;

  const availableToDate = carSpace?.available_to_date
    ? new Date(carSpace.available_to_date)
    : undefined;

  const availableWeekDays = carSpace?.available_week_days
    ?.split(",")
    .map((d) => Number(d));

  const availableFromTime = carSpace?.available_from_time
    ? new Date(carSpace.available_from_time)
    : undefined;

  const availableToTime = carSpace?.available_to_time
    ? new Date(carSpace.available_to_time)
    : undefined;

  const unavailableFromDate = carSpace?.unavailable_from_date
    ? new Date(carSpace.unavailable_from_date)
    : undefined;

  const unavailableToDate = carSpace?.unavailable_to_date
    ? new Date(carSpace.unavailable_to_date)
    : undefined;

  const unavailableDates = carSpace?.unavailable_dates
    ? carSpace.unavailable_dates.split(",").map((d) => new Date(d))
    : undefined;

  const datesFromOtherBookings = getDatesFromOtherBookings(
    carSpace?.bookings_to_same_car_space || []
  );
  const getTotalUnavailableDates = () => {
    let res = [] as Date[];
    if (
      carSpace?.unavailable_type === UnavailableType.RANGE &&
      unavailableFromDate &&
      unavailableToDate
    ) {
      res = getDaysArray(unavailableFromDate, unavailableToDate);
    } else if (
      carSpace?.unavailable_type === UnavailableType.PICKER &&
      unavailableDates
    ) {
      res = unavailableDates;
    }

    res = res.concat(datesFromOtherBookings);
    return res;
  };

  const disabledFromDate = (day: Date) => {
    return (
      (carSpace?.available_type === AvailableType.CUSTOM &&
        availableFromDate &&
        availableToDate &&
        (!availableWeekDays?.includes(getDay(day)) ||
          day.getTime() < availableFromDate.getTime() ||
          day.getTime() > availableToDate.getTime())) ||
      isIncludeDate(unavailableDates || [], day) ||
      myIsPast(day)
    );
  };

  const disabledToDate = (day: Date) => {
    return startDate
      ? (carSpace?.available_type === AvailableType.CUSTOM &&
          availableToDate &&
          (!availableWeekDays?.includes(getDay(day)) ||
            day.getTime() > availableToDate.getTime())) ||
          isIncludeDate(unavailableDates || [], day) ||
          day.getTime() < startDate.getTime()
      : true;
  };

  const handleUpdate = () => {
    if (carSpace) {
      if (startDate && endDate) {
        if (!isValidDate(startDate) || disabledFromDate(startDate)) {
          reportMessage("Please provide valid start date", "error");
          return;
        }
        if (!isValidDate(endDate) || disabledToDate(endDate)) {
          reportMessage("Please provide valid end date", "error");
          return;
        }

        const data = {
          start_date: startDate.toLocaleDateString(),
          end_date: endDate.toLocaleDateString(),
          price: getTotalPrice(),
          picked_dates: bookedDays.map((d) => d.toLocaleDateString()).join(","),
        };
        setRequestUpdate({
          method: "put" as Method,
          url: `/bookings/${id}`,
          data,
        });
      } else {
        reportMessage("Please provide start date and end date", "error");
      }
    }
  };

  const handleReview = useCallback(
    (event: any) => {
      if (booking) {
        setRequestCreateReview({
          method: "post" as Method,
          url: `car-spaces/${carSpace.id}/comment`,
          data: {
            content,
            rating,
          },
        });
      }
    },
    [booking, setRequestCreateReview, carSpace.id, content, rating]
  );

  const [setRequestReport] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      reportMessage("Report has been sent successfully!", "success");
      setReportModal(false);
    },
  });

  const comment = useMemo(() => {
    if (
      booking &&
      booking.status === BookingStatus.PAID &&
      isPast(new Date(booking.start_date))
    ) {
      return (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Stack spacing={2}>
            <Typography variant='h5' component='h2'>
              What are your thoughts?
            </Typography>
            <Rating
              name='rating'
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue as number);
              }}
            />
            <TextField
              id='outlined-multiline-static'
              label='Review'
              multiline
              rows={4}
              sx={{ mt: 1 }}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button onClick={handleReview}>Submit</Button>
            <Button color='error' onClick={openReport}>
              Report Problem
            </Button>
          </Stack>
        </Paper>
      );
    }
  }, [booking, handleReview, rating, content]);

  const button = useMemo(() => {
    if (booking && carSpace) {
      if (booking.status === BookingStatus.PENDING) {
        const total = booking?.price + carSpace.bond;
        return (
          <Grid container justifyContent='center' sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: String(total),
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions?.order?.capture().then((details) => {
                    handlePayBooking();
                  }) as Promise<void>;
                }}
              />
            </Grid>
            <Grid item xs={6} sx={{ pl: 1, pr: 1 }}>
              <Button
                fullWidth
                variant='contained'
                color='info'
                onClick={openUpdate}
              >
                Update Booking
              </Button>
            </Grid>
            <Grid item xs={6} sx={{ pl: 1, pr: 1 }}>
              <Button
                fullWidth
                variant='contained'
                color='error'
                onClick={handleCancel}
              >
                Cancel Booking
              </Button>
            </Grid>
          </Grid>
        );
      } else if (
        booking.status === BookingStatus.PAID &&
        !isPast(new Date(booking.start_date))
      ) {
        return (
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Grid container justifyContent='flex-end'>
              <Grid item sx={{ p: 1 }}>
                <Button
                  fullWidth
                  variant='contained'
                  color='error'
                  onClick={handleCancel}
                >
                  Cancel Booking
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      }
    }
  }, [booking, carSpace, handleCancel, handlePayBooking]);

  const banner = useMemo(() => {
    if (booking) {
      if (booking.status === BookingStatus.PENDING) {
        return (
          <Grid item xs={12}>
            <Grid container justifyContent='center'>
              <Countdown
                date={Date.parse(booking.created_at) + 900000}
                renderer={CountdownChip}
                onComplete={() =>
                  reportMessage(
                    "Sorry, your pending booking is expired, please refresh the page",
                    "info"
                  )
                }
              />
            </Grid>
          </Grid>
        );
      }
    }
  }, [booking, reportMessage]);

  const loading = isFetchingBooking || !booking;

  return (
    <>
      <Head>
        <title>{carSpace.title || ""} - Where2Park</title>
        <meta name='description' content='Where2Park Booking Detail Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer loading={loading}>
        <Box component='form'>
          <Grid container spacing={3}>
            {/*Button Grid*/}
            {banner}
            {/*Left Section*/}
            <Grid item xs={12} md={6} lg={8}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h3' component='h2'>
                      {carSpace.title + " (" + booking?.status + ")"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant='h6' component='h2'>
                      {carSpace.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container>
                        <Grid container marginTop={1}>
                          <Grid item xs={12} md={6}>
                            <Typography
                              gutterBottom
                              variant='h5'
                              component='h2'
                            >
                              Space Type
                            </Typography>
                            <Typography>{carSpace.car_space_type}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              gutterBottom
                              variant='h5'
                              component='h2'
                            >
                              Access
                            </Typography>
                            <Typography>{carSpace.access_type}</Typography>
                          </Grid>
                        </Grid>
                        <Grid container marginTop={1}>
                          <Grid item xs={12} md={6}>
                            <Typography
                              gutterBottom
                              variant='h5'
                              component='h2'
                            >
                              Max Allowed Vehicle
                            </Typography>
                            <Typography>
                              {carSpace.max_allowed_vehicle}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              gutterBottom
                              variant='h5'
                              component='h2'
                            >
                              Amenities
                            </Typography>
                            <Stack flexDirection='row' gap={1} flexWrap='wrap'>
                              {carSpace.amenities
                                ?.split(",")
                                .map((item, index) => (
                                  <Chip key={index} label={item} />
                                ))}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container>
                        <Typography gutterBottom variant='h5' component='h2'>
                          Size
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Typography>
                              <b>Length:</b> {carSpace.size_length} m
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography>
                              <b>Width:</b> {carSpace.size_width} m
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography>
                              <b>Height:</b>{" "}
                              {carSpace.max_height
                                ? `${carSpace.max_height} m`
                                : "No limit"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md>
                          <Typography variant='h5' component='h2'>
                            Map
                          </Typography>
                          {carSpace && (
                            <MapView
                              latitude={carSpace.latitude}
                              longitude={carSpace.longitude}
                              zoom={13}
                              pinLocation={[
                                carSpace.latitude,
                                carSpace.longitude,
                              ]}
                              readonly
                              height={300}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md>
                          <Typography variant='h5' component='h2'>
                            Photo
                          </Typography>
                          <CarSpaceImage
                            src={carSpace.image}
                            height={300}
                            width={400}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant='h5' component='h2'>
                            Description
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            {carSpace.description ?? (
                              <Typography variant='caption'>
                                No description available
                              </Typography>
                            )}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant='h5' component='h2'>
                            Instructions
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography>
                            {carSpace.instructions ?? (
                              <Typography variant='caption'>
                                No instruction available
                              </Typography>
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/*Right Section*/}
            <Grid item xs={12} md={6} lg={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={2} />
                  <Grid item xs={8}>
                    <Typography variant='h6' component='h3' align='center'>
                      Your booking info
                    </Typography>
                  </Grid>
                  <Grid item xs={2} />
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} />
                  <Grid item xs={4}>
                    <Typography variant='h6' component='h3' align='center'>
                      Price
                    </Typography>
                  </Grid>
                  <Grid item xs={4} />
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} />
                  <Grid item xs={4}>
                    <PriceTag price={booking?.price as number} discount={0} />
                  </Grid>
                  <Grid item xs={4} />
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} />
                  <Grid item xs={4}>
                    <Typography variant='h6' component='h3' align='center'>
                      Bond
                    </Typography>
                  </Grid>
                  <Grid item xs={4} />
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4} />
                  <Grid item xs={4}>
                    <PriceTag price={carSpace.bond as number} discount={0} />
                  </Grid>
                  <Grid item xs={4} />
                </Grid>
                <Grid container mt={1}>
                  <Grid item xs={12}>
                    <PickedDatesAccordion
                      dates={
                        booking?.picked_dates
                          .split(",")
                          .map((d) => new Date(d)) || []
                      }
                    />
                    {button}
                  </Grid>
                </Grid>
              </Paper>
              <Paper sx={{ p: 2, mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h5' component='h2'>
                      Provider
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
                    <Typography>
                      {carSpace.provider?.name || "provider name"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              {comment}
            </Grid>
          </Grid>
        </Box>
      </MainContainer>
      {carSpace && (
        <>
          <UpdateBookingDialog
            open={updateModal}
            handleUpdateBooking={handleUpdate}
            handleClose={handleClose}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            availableType={carSpace.available_type}
            availableFromDate={availableFromDate}
            availableToDate={availableToDate}
            availableWeekDays={availableWeekDays}
            availableFromTime={availableFromTime}
            availableToTime={availableToTime}
            unavailableType={carSpace.unavailable_type}
            unavailableFromDate={unavailableFromDate}
            unavailableToDate={unavailableToDate}
            unavailableDates={getTotalUnavailableDates()}
            disabledFromDate={disabledFromDate}
            disabledToDate={disabledToDate}
            bookedDays={bookedDays}
            totalPrice={getTotalPrice()}
          />
          <ReportDialog
            open={reportModal}
            bookingId={String(booking?.id)}
            handleClose={handleClose}
            setRequestReport={setRequestReport}
          />
        </>
      )}
    </>
  );
};

export default BookingDetail;
