import { useState, useEffect, useMemo, useReducer } from "react";
// next
import { useRouter } from "next/router";
import Head from "next/head";
// mui
import {
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Rating,
  ListItemButton,
  ListItemText,
  Collapse,
  Avatar,
  Button,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// internal
import CarSpaceImage from "components/CarSpaceImage";
import CustomerDatePicker from "components/CustomerDatePicker";
import MainContainer from "components/MainContainer";
import CarSpace, { AvailableType, UnavailableType } from "models/CarSpace";
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import {
  getUnavailableDates,
  calcBookingPrice,
  getBookedDays,
  getDatesFromOtherBookings,
  createTimeSorter,
  getDiscountRate,
  getDaysArray,
  isIncludeDate,
  isValidDate,
} from "utils/utils";
import MapView from "components/MapView";
import CommentCard from "components/CommentCard";
import LikeDislikeButtonGroup from "components/LikeDislikeButtonGroup";
import { BookmarkType } from "pages/user-profile";
import PriceTag from "components/PriceTag";
import PickedDatesAccordion from "components/PickedDatesAccordion";
// third-party
import "mapbox-gl/dist/mapbox-gl.css";
import { Method } from "axios";
import _ from "lodash";
import { getDay, isPast } from "date-fns";

export default function CarSpaceDetail() {
  const { token, user, reportMessage, setRecentHistory, requestUser } =
    useApplicationContext();
  const router = useRouter();
  const { id } = router.query;

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showComments, toggleComments] = useReducer((state) => !state, false);

  const [setRequestCarSpace, isFetchingCarSpace, carSpace] =
    useAuthedApiCall<CarSpace>({
      requestInfo: {} as any,
      requireAuth: false,
    });
  const [setRequestCreateBooking, isCreatingBooking] = useAuthedApiCall<{
    new_booking_id: number;
  }>({
    requestInfo: {} as any,
    callbackAfter: (data) => {
      router.push(`/view-booking/${data.new_booking_id}`);
    },
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      setRequestCarSpace({
        method: "get" as Method,
        url: `/public/car-spaces/${id}`,
      });
    }
  }, [id, setRequestCarSpace]);

  const getTotalPrice = () => {
    if (
      carSpace &&
      startDate &&
      endDate &&
      !disabledFromDate(startDate) &&
      !disabledFromDate(endDate)
    ) {
      let totalPrice = calcBookingPrice(
        carSpace.price_per_day,
        carSpace.price_per_week,
        carSpace.price_per_month,
        undefined,
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
      );
      if (user?.first_timer && carSpace.provider?.discount_rate) {
        totalPrice *= 1 - carSpace.provider?.discount_rate / 100;
      }
      return Math.round(totalPrice * 100) / 100;
    }
  };

  const bookedDays = useMemo(() => {
    if (startDate && endDate) {
      return getBookedDays(
        startDate,
        endDate,
        carSpace?.available_week_days?.split(",").map((d) => Number(d)) || [
          0, 1, 2, 3, 4, 5, 6,
        ],
        getUnavailableDates(
          carSpace?.unavailable_type || 0,
          carSpace?.unavailable_dates,
          carSpace?.unavailable_from_date
            ? new Date(carSpace?.unavailable_from_date)
            : undefined,
          carSpace?.unavailable_to_date
            ? new Date(carSpace?.unavailable_to_date)
            : undefined
        )
      ).sort((a, b) => a.getTime() - b.getTime());
    }
    return [];
  }, [
    carSpace?.available_week_days,
    carSpace?.unavailable_dates,
    carSpace?.unavailable_from_date,
    carSpace?.unavailable_to_date,
    carSpace?.unavailable_type,
    endDate,
    startDate,
  ]);

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
    const tomorrow = new Date(day.getTime());
    tomorrow.setDate(tomorrow.getDate() + 1);
    return (
      (carSpace?.available_type === AvailableType.CUSTOM &&
        availableFromDate &&
        availableToDate &&
        (!availableWeekDays?.includes(getDay(day)) ||
          day.getTime() < availableFromDate.getTime() ||
          day.getTime() > availableToDate.getTime())) ||
      isIncludeDate(unavailableDates || [], day) ||
      isPast(tomorrow)
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

  const handleBook = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) {
      reportMessage("You have not log in!", "warning");
    } else {
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
            car_space_id: carSpace.id,
            start_date: startDate.toLocaleDateString(),
            end_date: endDate.toLocaleDateString(),
            price: getTotalPrice(),
            picked_dates: bookedDays
              .map((d) => d.toLocaleDateString())
              .join(","),
            provider_id: carSpace.provider_id,
          };
          setRequestCreateBooking({
            method: "post" as Method,
            url: "/bookings",
            data,
          });
        } else {
          reportMessage("Please provide start date and end date", "error");
        }
      }
    }
  };

  const [setRequestLikeDislikeCarSpace] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      requestUser();
    },
  });

  // add this car space to browse history when mounted
  useEffect(() => {
    if (carSpace) {
      const history = localStorage.getItem("history") || "[]";
      const historyList = JSON.parse(history) as Array<any>;
      const indexFound = historyList.findIndex(
        (item) => item.id === carSpace.id
      );
      if (indexFound !== -1 && indexFound !== 0) {
        // found and not the first one
        // remove it
        const item = historyList.splice(indexFound, 1)[0];
        historyList.unshift(item);
      }
      if (indexFound === -1) {
        // not found
        if (historyList.length === 10) {
          // too many items
          // remove the least recent one
          historyList.pop();
        }
        historyList.unshift(_.pick(carSpace, ["title", "id"]));
      }
      setRecentHistory(historyList);
      localStorage.setItem("history", JSON.stringify(historyList));
    }
  }, [carSpace, setRecentHistory]);

  const loading = isFetchingCarSpace || !carSpace || isCreatingBooking;

  const likeDislikeButtons = useMemo(() => {
    if (user) {
      const liked = user?.liked_car_spaces?.split(",");
      const disliked = user?.disliked_car_spaces?.split(",");
      let type = BookmarkType.NONE;
      if (liked?.includes(String(carSpace?.id))) {
        type = BookmarkType.LIKED;
      } else if (disliked?.includes(String(carSpace?.id))) {
        type = BookmarkType.DISLIKED;
      }
      return (
        <LikeDislikeButtonGroup
          currentBookmarkType={type}
          carSpaceId={carSpace?.id as number}
          setRequestLikeDislikeCarSpace={setRequestLikeDislikeCarSpace}
        />
      );
    }
  }, [carSpace?.id, setRequestLikeDislikeCarSpace, user]);

  const discount = getDiscountRate(
    user?.first_timer ?? false,
    carSpace?.provider?.discount_rate ?? 0
  );

  return (
    <>
      <Head>
        <title>{carSpace?.title || ""} - Where2Park</title>
        <meta name='description' content='Where2Park Car Space Detail Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer loading={loading}>
        <Box component='form' onSubmit={handleBook}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant='h3' component='h2'>
                      {carSpace?.title}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant='h6' component='h2'>
                      {carSpace?.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    {likeDislikeButtons}
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
                            <Typography>{carSpace?.car_space_type}</Typography>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Typography
                              gutterBottom
                              variant='h5'
                              component='h2'
                            >
                              Access
                            </Typography>
                            <Typography>{carSpace?.access_type}</Typography>
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
                              {carSpace?.max_allowed_vehicle}
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
                              {carSpace?.amenities
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
                          <Grid item xs={12} md>
                            <Typography>
                              <b>Length:</b> {carSpace?.size_length} m
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md>
                            <Typography>
                              <b>Width:</b> {carSpace?.size_width} m
                            </Typography>
                          </Grid>
                          <Grid item xs={12} md>
                            <Typography>
                              <b>Height:</b>{" "}
                              {carSpace?.max_height
                                ? `${carSpace?.max_height} m`
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
                            src={carSpace?.image}
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
                            {carSpace?.description ?? (
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
                            {carSpace?.instructions ?? (
                              <Typography variant='caption'>
                                No instruction available
                              </Typography>
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid
                          item
                          xs={12}
                          container
                          alignItems='center'
                          gap={2}
                        >
                          <Typography variant='h5' component='h2'>
                            Rating:
                          </Typography>
                          <Rating
                            name='read-only'
                            value={
                              (carSpace?.comments?.reduce(
                                (acc, item) => acc + (item.rating || 0),
                                0
                              ) || 0) / (carSpace?.comments?.length || 1)
                            }
                            readOnly
                          />
                          <Typography variant='caption'>
                            {carSpace?.comments?.length} comments
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant='h5' component='h2'>
                            Comments:
                          </Typography>
                          <ListItemButton onClick={toggleComments}>
                            <ListItemText primary='Show' />
                            {showComments ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </ListItemButton>
                          <Collapse
                            in={showComments}
                            timeout='auto'
                            unmountOnExit
                          >
                            <Stack spacing={2}>
                              {carSpace?.comments
                                ?.sort(createTimeSorter)
                                .map((comment) => (
                                  <CommentCard
                                    key={comment.id}
                                    comment={comment}
                                  />
                                ))}
                            </Stack>
                          </Collapse>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            {/*Right Section*/}
            <Grid item xs={12} md={6} lg={4}>
              <Paper sx={{ p: 2 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant='h6' component='h2'>
                      Provider
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
                    <Typography>
                      {carSpace?.provider?.name || "provider name"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  mt: 2,
                }}
              >
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
                    <PriceTag price={carSpace?.bond as number} discount={0} />
                  </Grid>
                  <Grid item xs={4} />
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography
                      variant='h6'
                      component='h3'
                      sx={{ pt: 1 }}
                      align='center'
                    >
                      Daily Price
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant='h6'
                      component='h3'
                      sx={{ pt: 1 }}
                      align='center'
                    >
                      Weekly Price
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography
                      variant='h6'
                      component='h3'
                      sx={{ pt: 1 }}
                      align='center'
                    >
                      Monthly Price
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <PriceTag
                      price={carSpace?.price_per_day as number}
                      discount={discount}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <PriceTag
                      price={carSpace?.price_per_week as number}
                      discount={discount}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <PriceTag
                      price={carSpace?.price_per_month as number}
                      discount={discount}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {carSpace && (
                    <CustomerDatePicker
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
                    />
                  )}
                  {startDate &&
                    endDate &&
                    !disabledFromDate(startDate) &&
                    !disabledToDate(endDate) && (
                      <PickedDatesAccordion dates={bookedDays} />
                    )}
                </Grid>
                {/*Right: Section 3*/}

                {startDate &&
                  endDate &&
                  !disabledFromDate(startDate) &&
                  !disabledToDate(endDate) && (
                    <Box sx={{ mt: 1 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={4} />
                        <Grid item xs={4}>
                          <Typography
                            variant='h6'
                            component='h3'
                            align='center'
                          >
                            Total Price
                          </Typography>
                        </Grid>
                        <Grid item xs={4} />
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={4} />
                        <Grid item xs={4}>
                          <PriceTag
                            price={getTotalPrice() as number}
                            discount={0}
                          />
                        </Grid>
                        <Grid item xs={4} />
                      </Grid>
                    </Box>
                  )}
                {!!token && (
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12}>
                      <Button fullWidth variant='contained' type='submit'>
                        Book
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </MainContainer>
    </>
  );
}
