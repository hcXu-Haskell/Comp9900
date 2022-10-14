import { useCallback, useState, useEffect } from "react";
// next
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
// mui
import {
  Box,
  Link,
  CardMedia,
  Grid,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  InputAdornment,
  Tooltip,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
// internal
import AvailableBox from "components/AvailableBox";
import AddressSearch, { Address } from "components/AddressSearch";
import { convertBase64, isValidDate, myIsPast } from "utils/utils";
import {
  CarSpaceType,
  AccessType,
  VehicleType,
  AmenityType,
  AvailableType,
  UnavailableType,
} from "models/CarSpace";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import useApplicationContext from "hooks/useApplicationContext";
import MainContainer from "components/MainContainer";
import MapView from "components/MapView";
// third-party
import "mapbox-gl/dist/mapbox-gl.css";
import { Method } from "axios";
import { SIZE_CONTROL_PROP } from "utils/constants";
import { formatISO } from "date-fns";

const RegisterCarSpace: NextPage = () => {
  const router = useRouter();
  const { jump } = router.query;
  const { token, reportMessage } = useApplicationContext();
  // form controlled states
  const [img, setImg] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  // available box states
  const [unavailableType, setUnavailableType] = useState(UnavailableType.RANGE);
  const [unavailableDate, setUnavailableDate] = useState<Date | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [unavailableFromDate, setUnavailableFromDate] = useState<Date | null>(
    null
  );
  const [unavailableToDate, setUnavailableToDate] = useState<Date | null>(null);

  const [availableType, setAvailableType] = useState(AvailableType.ALWAYS);
  const [availableFromTime, setAvailableFromTime] = useState<Date | null>(null);
  const [availableToTime, setAvailableToTime] = useState<Date | null>(null);
  const [availableFromDate, setAvailableFromDate] = useState<Date | null>(null);
  const [availableToDate, setAvailableToDate] = useState<Date | null>(null);
  const [availableWeekDays, setAvailableWeekDays] = useState<number[]>([]);
  // address search states
  const [selectedAddress, setSelectedAddress] = useState<
    Address | string | null
  >(null);

  const [searchValue, setSearchValue] = useState("");

  const [setRequestRegisterCarSpace] = useAuthedApiCall<{
    new_car_space_id: number;
  }>({
    requestInfo: {} as any,
    callbackAfter: (data) => {
      router.push(`/car-space-detail/${data.new_car_space_id}`);
    },
  });

  // if not login, redirect user to login page
  useEffect(() => {
    if (!token) {
      router.push(`/login?jump=${encodeURIComponent(window.location.href)}`);
    }
  }, [router, token]);

  const handleCheck = (event: any) => {
    let updatedList = [...amenities];
    if (event.target.checked) {
      updatedList = [...amenities, event.target.value];
    } else {
      updatedList.splice(amenities.indexOf(event.target.value), 1);
    }
    setAmenities(updatedList);
  };

  const handleImg = async (event: any) => {
    const file = (event.target as HTMLInputElement).files as FileList;
    const base64 = (await convertBase64(file[0])) as string;
    setImg(base64);
  };

  const getPostData = useCallback(
    (form: HTMLFormElement) => {
      const data = new FormData(form);

      return {
        title: data.get("title"),
        bond: data.get("bond"),
        image: img,
        size_length: data.get("length"),
        size_width: data.get("width"),
        max_height: data.get("max_height") || null,
        max_allowed_vehicle: data.get("max_vehicle"),
        car_space_type: data.get("spaceType"),
        amenities: amenities.length > 0 ? amenities.join(",") : null,
        access_type: data.get("access"),
        price_per_day: data.get("dPrice"),
        price_per_week: data.get("wPrice"),
        price_per_month: data.get("mPrice"),
        address_id: (selectedAddress as Address).id,
        address: (selectedAddress as Address).address,
        latitude: (selectedAddress as Address).latitude,
        longitude: (selectedAddress as Address).longitude,
        unavailable_type: unavailableType,
        unavailable_dates:
          unavailableType === UnavailableType.PICKER
            ? unavailableDates.map((d) => d.toLocaleDateString()).join(",")
            : null,
        unavailable_from_date:
          unavailableType === UnavailableType.RANGE
            ? unavailableFromDate?.toLocaleDateString()
            : null,
        unavailable_to_date:
          unavailableType === UnavailableType.RANGE
            ? unavailableToDate?.toLocaleDateString()
            : null,
        available_type: availableType,
        available_from_time:
          availableType === AvailableType.CUSTOM && availableFromTime
            ? formatISO(availableFromTime)
            : null,
        available_to_time:
          availableType === AvailableType.CUSTOM && availableToTime
            ? formatISO(availableToTime)
            : null,
        available_from_date:
          availableType === AvailableType.CUSTOM
            ? availableFromDate?.toLocaleDateString()
            : null,
        available_to_date:
          availableType === AvailableType.CUSTOM
            ? availableToDate?.toLocaleDateString()
            : null,
        available_week_days:
          availableType === AvailableType.CUSTOM
            ? availableWeekDays.join(",")
            : null,
        description: data.get("description") || null,
        instructions: data.get("instructions") || null,
      };
    },
    [
      amenities,
      availableFromDate,
      availableFromTime,
      availableToDate,
      availableToTime,
      availableType,
      availableWeekDays,
      img,
      selectedAddress,
      unavailableDates,
      unavailableFromDate,
      unavailableToDate,
      unavailableType,
    ]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedAddress) {
      reportMessage("You have not selected a valid address", "error");
      return;
    }

    if (availableType === AvailableType.CUSTOM) {
      if (
        !availableFromTime ||
        !availableToTime ||
        !availableFromDate ||
        !availableToDate ||
        availableWeekDays.length === 0
      ) {
        reportMessage(
          "Please provide the availability of your car space.",
          "error"
        );
        return;
      }
      if (!isValidDate(availableFromDate) || myIsPast(availableFromDate)) {
        reportMessage("Please provide valid available from date", "error");
        return;
      }

      if (!isValidDate(availableToDate) || myIsPast(availableToDate)) {
        reportMessage("Please provide valid available to date", "error");
        return;
      }
    }

    if (unavailableType === UnavailableType.RANGE) {
      if (unavailableFromDate && !unavailableToDate) {
        reportMessage("Please provide unavailable to date", "error");
        return;
      }
      if (unavailableFromDate && unavailableToDate) {
        if (
          !isValidDate(unavailableFromDate) ||
          myIsPast(unavailableFromDate)
        ) {
          reportMessage("Please provide valid unavailable from date", "error");
          return;
        }
        if (!isValidDate(unavailableToDate) || myIsPast(unavailableToDate)) {
          reportMessage("Please provide valid unavailable to date", "error");
          return;
        }
      }
    }
    const data = getPostData(event.currentTarget);

    setRequestRegisterCarSpace({
      method: "post" as Method,
      url: `/car-spaces`,
      data,
    });
  };

  return (
    <>
      <Head>
        <title>Register my car space - Where2Park</title>
        <meta name='description' content='Where2Park Register Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer>
        <Box component='form' onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/*Button Grid*/}
            <Grid item xs={12}>
              <Grid container justifyContent='flex-end'>
                <Grid item sx={{ p: 1 }}>
                  <Button
                    fullWidth
                    variant='contained'
                    color='error'
                    component={Link}
                    href={jump && typeof jump === "string" ? jump : "/"}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item sx={{ p: 1 }}>
                  <Button type='submit' fullWidth variant='contained'>
                    Register
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            {/*Left Section*/}
            <Grid item xs={12} md={6} lg={8}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/*Left: Section 1*/}
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6}>
                    <TextField
                      required
                      fullWidth
                      name='title'
                      label='Title'
                      id='title'
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <AddressSearch
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setSelectedAddress}
                      searchValue={searchValue}
                      setSearchValue={setSearchValue}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          fullWidth
                          label='Address'
                          name='address'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Car Space Type</InputLabel>
                      <Select
                        id='space-type'
                        name='spaceType'
                        label='Car Space Type'
                        defaultValue=''
                      >
                        {(
                          Object.keys(CarSpaceType) as Array<
                            keyof typeof CarSpaceType
                          >
                        ).map((key) => (
                          <MenuItem key={key} value={CarSpaceType[key]}>
                            {CarSpaceType[key]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Access</InputLabel>
                      <Select
                        id='access'
                        name='access'
                        label='Access'
                        defaultValue=''
                      >
                        {(
                          Object.keys(AccessType) as Array<
                            keyof typeof AccessType
                          >
                        ).map((key) => (
                          <MenuItem key={key} value={AccessType[key]}>
                            {AccessType[key]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Max Allowed Vehicle</InputLabel>
                      <Select
                        id='max_vehicle'
                        name='max_vehicle'
                        label='Max Allowed Vehicle'
                        defaultValue=''
                      >
                        {(
                          Object.keys(VehicleType) as Array<
                            keyof typeof VehicleType
                          >
                        ).map((key) => (
                          <MenuItem key={key} value={VehicleType[key]}>
                            {VehicleType[key]}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={10} lg={4}>
                        <FormControl fullWidth required variant='standard'>
                          <InputLabel htmlFor='filled-adornment-amount'>
                            Length
                          </InputLabel>
                          <Input
                            type='number'
                            name='length'
                            id='length'
                            inputProps={SIZE_CONTROL_PROP}
                            endAdornment={
                              <InputAdornment position='end'>m</InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={10} lg={4}>
                        <FormControl fullWidth required variant='standard'>
                          <InputLabel htmlFor='filled-adornment-amount'>
                            Width
                          </InputLabel>
                          <Input
                            type='number'
                            name='width'
                            id='width'
                            inputProps={SIZE_CONTROL_PROP}
                            endAdornment={
                              <InputAdornment position='end'>m</InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item container xs={12} lg={4} alignItems='flex-end'>
                        <Grid item xs={10} lg={8}>
                          <FormControl fullWidth variant='standard'>
                            <InputLabel htmlFor='filled-adornment-amount'>
                              Height
                            </InputLabel>
                            <Input
                              type='number'
                              name='height'
                              id='height'
                              inputProps={SIZE_CONTROL_PROP}
                              endAdornment={
                                <InputAdornment position='end'>
                                  m
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        </Grid>
                        <Grid item>
                          <Tooltip
                            title='If no height limit, leave it blank'
                            placement='right'
                          >
                            <IconButton>
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {/*Left: Section 2*/}
                <Grid container spacing={2}>
                  <Grid item xs={12} lg={6} sx={{ minHeight: "20vh" }}>
                    <Typography
                      variant='h5'
                      component='h2'
                      sx={{ mt: 1, mb: 1 }}
                    >
                      Map
                    </Typography>
                    {selectedAddress && (
                      <MapView
                        latitude={Number((selectedAddress as Address).latitude)}
                        longitude={Number(
                          (selectedAddress as Address).longitude
                        )}
                        zoom={13}
                        pinLocation={[
                          (selectedAddress as Address).latitude,
                          (selectedAddress as Address).longitude,
                        ]}
                        readonly
                        height={300}
                      />
                    )}
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Typography
                      variant='h5'
                      component='h2'
                      sx={{ mt: 1, mb: 1 }}
                    >
                      Photo
                    </Typography>
                    {img && (
                      <CardMedia
                        component='img'
                        src={img}
                        alt='Car Space Image'
                        sx={{ height: 300, mb: 1 }}
                      />
                    )}
                    <Button variant='contained' component='label'>
                      Upload Photo
                      <input
                        type='file'
                        hidden
                        name='photo'
                        onChange={handleImg}
                      />
                    </Button>
                  </Grid>
                </Grid>
                {/*Left: Section 3*/}
                <Grid container gap={1}>
                  <Grid item xs={12}>
                    <Typography
                      variant='h5'
                      component='h2'
                      sx={{ mt: 1, mb: 1 }}
                    >
                      Amenities
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup row>
                      {(
                        Object.keys(AmenityType) as Array<
                          keyof typeof AmenityType
                        >
                      ).map((key) => (
                        <FormControlLabel
                          key={key}
                          control={<Checkbox />}
                          label={AmenityType[key]}
                          value={AmenityType[key]}
                          onChange={handleCheck}
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                </Grid>
                {/*Left: Section 4*/}
                <Grid container gap={1}>
                  <Grid item xs={12}>
                    <Typography variant='h5' component='h2' sx={{ pt: 1 }}>
                      Description
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      name='description'
                      label='Write your description here.'
                      id='description'
                    />
                  </Grid>
                </Grid>
                {/*Left: Section 5*/}
                <Grid container gap={1}>
                  <Grid item xs={12}>
                    <Typography variant='h5' component='h2' sx={{ pt: 1 }}>
                      Instructions
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      name='instructions'
                      label='What instructions do you want to tell your customer?'
                      id='instructions'
                    />
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
                  <Grid item xs={12}>
                    <FormControl fullWidth required variant='standard'>
                      <InputLabel htmlFor='filled-adornment-amount'>
                        Bond
                      </InputLabel>
                      <Input
                        type='number'
                        name='bond'
                        id='bond'
                        startAdornment={
                          <InputAdornment position='start'>A$</InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <FormControl fullWidth required variant='standard'>
                      <InputLabel htmlFor='filled-adornment-amount'>
                        Daily Price
                      </InputLabel>
                      <Input
                        type='number'
                        name='dPrice'
                        id='dPrice'
                        startAdornment={
                          <InputAdornment position='start'>A$</InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth required variant='standard'>
                      <InputLabel htmlFor='filled-adornment-amount'>
                        Weekly Price
                      </InputLabel>
                      <Input
                        type='number'
                        name='wPrice'
                        id='wPrice'
                        startAdornment={
                          <InputAdornment position='start'>A$</InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth required variant='standard'>
                      <InputLabel htmlFor='filled-adornment-amount'>
                        Monthly Price
                      </InputLabel>
                      <Input
                        type='number'
                        name='mPrice'
                        id='mPrice'
                        startAdornment={
                          <InputAdornment position='start'>A$</InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <AvailableBox
                      unavailableType={unavailableType}
                      setUnavailableType={setUnavailableType}
                      unavailableDate={unavailableDate}
                      setUnavailableDate={setUnavailableDate}
                      unavailableDates={unavailableDates}
                      setUnavailableDates={setUnavailableDates}
                      unavailableFromDate={unavailableFromDate}
                      setUnavailableFromDate={setUnavailableFromDate}
                      unavailableToDate={unavailableToDate}
                      setUnavailableToDate={setUnavailableToDate}
                      availableType={availableType}
                      setAvailableType={setAvailableType}
                      availableFromTime={availableFromTime}
                      setAvailableFromTime={setAvailableFromTime}
                      availableToTime={availableToTime}
                      setAvailableToTime={setAvailableToTime}
                      availableFromDate={availableFromDate}
                      availableToDate={availableToDate}
                      setAvailableToDate={setAvailableToDate}
                      availableWeekDays={availableWeekDays}
                      setAvailableWeekDays={setAvailableWeekDays}
                      setAvailableFromDate={setAvailableFromDate}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </MainContainer>
    </>
  );
};

export default RegisterCarSpace;
