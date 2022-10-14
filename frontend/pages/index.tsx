import { useCallback, useEffect, useMemo, useState } from "react";
// next
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
// mui
import {
  Button,
  TextField,
  ButtonGroup,
  InputAdornment,
  Stack,
  MenuItem,
  Box,
  Drawer,
  Grid,
  Typography,
  IconButton,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
// internal
import DropdownMenu from "components/DropdownMenu";
import CarSpaceListItem from "components/CarSpaceListItem";
import AddressSearch, { Address } from "components/AddressSearch";
import MainContainer from "components/MainContainer";
import PriceFilter from "components/PriceFilter";
import CarSpaceTypeFilter from "components/CarSpaceTypeFilter";
import DistanceFilter from "components/DistanceFilter";
import MapView from "components/MapView";
import {
  TopCities,
  SydneyLocation,
  MelbourneLocation,
  DRAWER_WIDTH_ON_MEDIUM,
  DRAWER_WIDTH_ON_SMALL,
  DEFAULT_DISTANCE_FILTER,
} from "utils/constants";
import CarSpace from "models/CarSpace";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import styles from "styles/Home.module.css";
import useApplicationContext from "hooks/useApplicationContext";
// third party
import qs from "qs";
import { Method } from "axios";
import _ from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";

export interface Query {
  latitude: number;
  longitude: number;
  distance: number;
  sortby?: string;
  order?: string;
  price?: string; // <min>,<max>,<type>
  cs_type?: string;
  is_login: boolean;
}

const Home: NextPage = () => {
  const { user, reportMessage, token } = useApplicationContext();
  const [searchValue, setSearchValue] = useState("");
  const theme = useTheme();
  const smMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  const router = useRouter();
  const { city } = router.query;
  const [isFetchingNearbySpaces, setIsFetchingNearbySpaces] = useState(false);

  const defaultQuery = useMemo(
    () => ({
      distance: DEFAULT_DISTANCE_FILTER,
      longitude: -1,
      latitude: -1,
      is_login: !!token,
    }),
    [token]
  );

  useEffect(() => {
    setQuery((q) => ({ ...q, is_login: !!token }));
  }, [token]);

  const [query, setQuery] = useState<Query>(defaultQuery);

  const [selectedAddress, setSelectedAddress] = useState<
    Address | string | null
  >(null);

  const [setRequestGetCarSpaces, isFetchingCarSpaces, carSpaces, setCarSpaces] =
    useAuthedApiCall<CarSpace[]>({
      requestInfo: {} as any,
      requireAuth: !!token,
      callbackAfter: () => {
        setIsFetchingNearbySpaces(false);
      },
    });

  const topCites = useMemo(
    () => Object.keys(TopCities).filter((x) => !(parseInt(x) >= 0)),
    []
  );

  // city or searched address
  useEffect(() => {
    if (selectedAddress) {
      router.replace(
        {
          pathname: "/",
        },
        undefined,
        { shallow: true }
      );
      if (typeof selectedAddress !== "string") {
        setQuery((q) => ({
          ...q,
          latitude: selectedAddress.latitude,
          longitude: selectedAddress.longitude,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddress]);

  useEffect(() => {
    if (city && typeof city === "string") {
      switch (city) {
        case "Sydney":
          setQuery((q) => ({
            ...q,
            latitude: SydneyLocation.latitude,
            longitude: SydneyLocation.longitude,
          }));
          break;
        case "Melbourne":
          setQuery((q) => ({
            ...q,
            latitude: MelbourneLocation.latitude,
            longitude: MelbourneLocation.longitude,
          }));
          break;
      }
    }
  }, [city]);

  useEffect(() => {
    if (user && user.nearby_parking) {
      if (navigator.geolocation) {
        setIsFetchingNearbySpaces(true);
        navigator.geolocation.getCurrentPosition((p) => {
          setQuery((q) => ({
            ...q,
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
          }));
        });
        setSearchValue("current location");
        reportMessage("Fetching nearby car spaces", "info");
      }
    }
  }, [reportMessage, user]);

  const fetchCarSpaceList = useCallback(
    async (query: Query) => {
      if (query.latitude === -1 && query.longitude === -1) {
        return;
      }
      const q = qs.stringify(query);
      setRequestGetCarSpaces({
        method: "get" as Method,
        url: `/public/car-spaces?${q}`,
      });
    },
    [setRequestGetCarSpaces]
  );

  // all search, filter, sort operations alter query
  // and query change triggers fetch function
  useEffect(() => {
    if (query) {
      fetchCarSpaceList(query);
    }
  }, [fetchCarSpaceList, query]);

  // filter button anchors
  const [priceAnchorEl, setPriceAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const pricePopoverId = "price-filter-popover";

  const [carSpaceTypeAnchorEl, setCarSpaceTypeAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const carSpaceTypePopoverId = "car-space-type-filter-popover";

  const [distanceAnchorEl, setDistanceAnchorEl] =
    useState<HTMLButtonElement | null>(null);
  const distancePopoverId = "distance-filter-popover";

  const handleClick = useCallback(
    (target: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      switch (target) {
        case "price":
          setPriceAnchorEl(event.currentTarget);
          break;
        case "type":
          setCarSpaceTypeAnchorEl(event.currentTarget);
          break;
        case "distance":
          setDistanceAnchorEl(event.currentTarget);
          break;
        default:
          break;
      }
    },
    []
  );

  const buttons = useMemo(
    () => [
      <Button
        key='price'
        aria-describedby={pricePopoverId}
        onClick={handleClick("price")}
      >
        Price
      </Button>,
      <Button
        key='type'
        aria-describedby={carSpaceTypePopoverId}
        onClick={handleClick("type")}
      >
        Type
      </Button>,
      <Button
        key='distance'
        aria-describedby={distancePopoverId}
        onClick={handleClick("distance")}
      >
        Distance
      </Button>,
    ],
    [handleClick]
  );

  const sortByMenuList = useMemo(
    () => [
      <MenuItem
        key='minPrice'
        onClick={() =>
          setQuery((q) => ({
            ...q,
            sortby: "price",
            order: "asc",
          }))
        }
      >
        Min Price
      </MenuItem>,
      <MenuItem
        key='maxPrice'
        onClick={() =>
          setQuery((q) => ({
            ...q,
            sortby: "price",
            order: "desc",
          }))
        }
      >
        Max Price
      </MenuItem>,
      <MenuItem
        key='minDistance'
        onClick={() =>
          setQuery((q) => ({
            ...q,
            sortby: "distance",
            order: "asc",
          }))
        }
      >
        Min Distance
      </MenuItem>,
      <MenuItem
        key='maxDistance'
        onClick={() =>
          setQuery((q) => ({
            ...q,
            sortby: "distance",
            order: "desc",
          }))
        }
      >
        Max Distance
      </MenuItem>,
      <MenuItem
        key='cancel'
        onClick={() => setQuery((q) => _.omit(q, ["sortby", "order"]))}
      >
        Cancel
      </MenuItem>,
    ],
    []
  );

  const cancelFilter = useCallback(
    (filter: "price" | "cs_type" | "distance") => () => {
      switch (filter) {
        case "price":
          setQuery((q) => _.omit(q, ["price"]));
          break;
        case "cs_type":
          setQuery((q) => _.omit(q, ["cs_type"]));
          break;
        case "distance":
          setQuery((q) => ({ ...q, distance: DEFAULT_DISTANCE_FILTER }));
          break;
        default:
          break;
      }
    },
    []
  );

  const cityShortCut = useMemo(
    () => (
      <Stack spacing={2} alignItems='center' sx={{ mt: 4 }}>
        <Typography
          sx={{ maxWidth: "300px", textAlign: "center" }}
          variant='subtitle2'
        >
          Search an address using the search bar above or click one of the top
          cities below
        </Typography>
        {topCites.map((city) => (
          <Button key={city} href={`/?city=${city}`}>
            {city}
          </Button>
        ))}
      </Stack>
    ),
    [topCites]
  );

  const carSpaceList = useMemo(() => {
    if (carSpaces) {
      if (carSpaces.length > 0) {
        return (
          <Stack
            gap={2}
            sx={{ pt: 1, pr: 1, flex: 1, overflowY: "scroll" }}
            className={styles.carSpaceList}
          >
            {carSpaces.map((cs) => (
              <CarSpaceListItem
                key={cs.id}
                carSpace={cs}
                liked={cs.id in (user?.liked_car_spaces?.split(",") ?? [])}
                first_timer={user?.first_timer}
              />
            ))}
          </Stack>
        );
      } else {
        return (
          <Typography
            variant='subtitle2'
            sx={{ fontSize: "20px", textAlign: "center", p: 2 }}
          >{`Sorry, we can't find any car space`}</Typography>
        );
      }
    } else {
      return cityShortCut;
    }
  }, [carSpaces, cityShortCut, user?.first_timer, user?.liked_car_spaces]);

  const sidebar = useMemo(
    () => (
      <>
        <Stack sx={{ pr: 2 }} spacing={1}>
          <AddressSearch
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder='Search'
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            onInputChange={(event, value, reason) => {
              if (reason === "clear") {
                setSearchValue("");
                setSelectedAddress(null);
                setCarSpaces(undefined);
                setQuery(defaultQuery);
              } else {
                setSearchValue(value);
              }
            }}
          />
          <Grid container alignItems='center'>
            <Grid item xs>
              <Typography>
                {carSpaces &&
                  `${carSpaces.length} results found near ${
                    city ? `${city} CBD` : searchValue
                  }`}
              </Typography>
            </Grid>
            <Grid item xs={3} container justifyContent='flex-end'>
              <DropdownMenu
                text={query.sortby || "Sort By"}
                menuList={sortByMenuList}
                endIcon={
                  query.order ? (
                    query.order === "desc" ? (
                      <ArrowDropDownIcon />
                    ) : (
                      <ArrowDropUpIcon />
                    )
                  ) : (
                    <SortIcon />
                  )
                }
              />
            </Grid>
          </Grid>
          <ButtonGroup aria-label='filter button group'>{buttons}</ButtonGroup>
          <Box>
            {query.price && (
              <Box>
                <Typography variant='caption'>
                  Price Range:
                  {` ${(() => {
                    const price = query.price.split(",");
                    return `$${price[0]} - $${price[1]} per ${
                      price[2][0].toUpperCase() + price[2].slice(1)
                    }`;
                  })()}`}
                </Typography>
                <IconButton size='small' onClick={cancelFilter("price")}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {query.cs_type && (
              <Box>
                <Typography variant='caption'>
                  Car Space Types: {query.cs_type}
                </Typography>
                <IconButton size='small' onClick={cancelFilter("cs_type")}>
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {query.distance && carSpaces && (
              <Box>
                <Typography variant='caption'>
                  Max Distance: {query.distance} km
                </Typography>
                {query.distance !== 200 && (
                  <Button
                    size='small'
                    sx={{ fontSize: "0.7rem" }}
                    onClick={cancelFilter("distance")}
                  >
                    Reset to 200km
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Stack>
        {carSpaceList}
      </>
    ),
    [
      searchValue,
      selectedAddress,
      carSpaces,
      city,
      query.sortby,
      query.order,
      query.price,
      query.cs_type,
      query.distance,
      sortByMenuList,
      buttons,
      cancelFilter,
      carSpaceList,
      setCarSpaces,
      defaultQuery,
    ]
  );

  // drawer
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const leftSideMenu = useCallback(
    () => (
      <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
        <IconButton
          size='large'
          aria-label='home page side bar'
          aria-controls='drawer-sidebar'
          aria-haspopup='true'
          onClick={handleDrawerOpen}
          color='inherit'
        >
          <MenuIcon />
        </IconButton>
      </Box>
    ),
    []
  );

  const drawerWidth = smMatches
    ? DRAWER_WIDTH_ON_MEDIUM
    : DRAWER_WIDTH_ON_SMALL;

  const loading = isFetchingCarSpaces || isFetchingNearbySpaces;

  return (
    <>
      <Head>
        <title>Where2Park</title>
        <meta name='description' content='Where2Park Main Page' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MainContainer loading={loading} leftSideMenu={leftSideMenu} isHomePage>
        <Grid container sx={{ height: "100%" }} gap={2}>
          <Grid
            item
            xs={4}
            container
            sx={{
              display: { xs: "none", md: "flex" },
              height: "100%",
            }}
            flexDirection='column'
          >
            {sidebar}
          </Grid>
          <Grid item xs>
            {carSpaces ? (
              <MapView
                latitude={query.latitude}
                longitude={query.longitude}
                zoom={13}
                pinsList={carSpaces}
              />
            ) : (
              !mdMatches && cityShortCut
            )}
          </Grid>
        </Grid>
      </MainContainer>
      <PriceFilter
        setQuery={setQuery}
        id={pricePopoverId}
        open={Boolean(priceAnchorEl)}
        anchorEl={priceAnchorEl}
        setAnchorEl={setPriceAnchorEl}
      />
      <CarSpaceTypeFilter
        setQuery={setQuery}
        id={carSpaceTypePopoverId}
        open={Boolean(carSpaceTypeAnchorEl)}
        anchorEl={carSpaceTypeAnchorEl}
        setAnchorEl={setCarSpaceTypeAnchorEl}
      />
      <DistanceFilter
        query={query}
        setQuery={setQuery}
        id={distancePopoverId}
        open={Boolean(distanceAnchorEl)}
        anchorEl={distanceAnchorEl}
        setAnchorEl={setDistanceAnchorEl}
      />
      <Drawer
        sx={{
          display: { md: "none", xs: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant='temporary'
        anchor='left'
        open={open}
      >
        <Stack
          sx={{
            p: "0px 8px",
            minHeight: {
              xs: 56,
              sm: 64,
            },
          }}
          alignItems='flex-end'
          justifyContent='center'
        >
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ p: 2, height: "calc(100vh-56px)", overflow: "hidden" }}>
          {sidebar}
        </Stack>
      </Drawer>
    </>
  );
};

export default Home;
