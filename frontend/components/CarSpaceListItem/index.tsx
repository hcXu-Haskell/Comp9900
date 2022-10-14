import { useCallback, useMemo, useState } from "react";
// mui
import {
  Card,
  Box,
  Typography,
  Chip,
  Button,
  MenuItem,
  Popover,
  Stack,
  useMediaQuery,
  useTheme,
  Grid,
  Tooltip,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// internal
import DropdownMenu from "components/DropdownMenu";
import CarSpace, { PriceType } from "models/CarSpace";
import CarSpaceImage from "components/CarSpaceImage";
import PriceTag from "components/PriceTag";
import { getDiscountRate } from "utils/utils";

interface CarSpaceListItemProps {
  carSpace: CarSpace;
  liked?: boolean;
  first_timer?: boolean;
}

const CarSpaceListItem: React.FC<CarSpaceListItemProps> = (props) => {
  const { carSpace, liked = false, first_timer = false } = props;
  const theme = useTheme();
  const lgMatches = useMediaQuery(theme.breakpoints.up("lg"));
  const smMatches = useMediaQuery(theme.breakpoints.up("sm"));
  const xsMatches = useMediaQuery(theme.breakpoints.down("sm"));

  // address popover control
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  // title popover control
  const [titleAnchorEl, setTitleAnchorEl] = useState<HTMLElement | null>(null);
  const handleTitlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTitleAnchorEl(event.currentTarget);
  };
  const handleTitlePopoverClose = () => {
    setTitleAnchorEl(null);
  };
  const titleOpen = Boolean(titleAnchorEl);

  const [priceType, setPriceType] = useState<PriceType>("Month");

  const getPrice = useCallback(
    (type: PriceType) => {
      switch (type) {
        case "Month":
          return carSpace.price_per_month;
        case "Week":
          return carSpace.price_per_week;
        case "Day":
          return carSpace.price_per_day;
      }
    },
    [carSpace.price_per_day, carSpace.price_per_month, carSpace.price_per_week]
  );

  const handleChangePriceType = (type: PriceType) => (e: React.MouseEvent) => {
    setPriceType(type);
  };

  const menuList = useMemo(
    () => [
      <MenuItem key='month' onClick={handleChangePriceType("Month")}>
        Month
      </MenuItem>,
      <MenuItem key='week' onClick={handleChangePriceType("Week")}>
        Week
      </MenuItem>,
      <MenuItem key='day' onClick={handleChangePriceType("Day")}>
        Day
      </MenuItem>,
    ],
    []
  );

  return (
    <>
      <Card
        sx={{
          display: "flex",
          height: lgMatches ? 150 : undefined,
          flexDirection: lgMatches ? "row" : "column",
          pb: lgMatches ? 0 : 1,
          gap: 2,
          minHeight: lgMatches ? 150 : 390,
          position: "relative",
        }}
      >
        {liked && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              textAlign: "right",
              pointerEvents: "none",
            }}
          >
            <Tooltip
              title='You have liked this car space'
              placement='top'
              sx={{ pointerEvents: "auto", cursor: "pointer" }}
            >
              <ThumbUpIcon fontSize='small' color='primary' />
            </Tooltip>
          </Box>
        )}
        <CarSpaceImage src={carSpace.image} height={150} width={150} />
        <Grid
          container
          flexDirection={xsMatches ? "column" : "row"}
          flex={1}
          justifyContent={smMatches ? "space-around" : "space-between"}
          sx={{ pl: 1, pr: 1 }}
          spacing={xsMatches ? 1 : undefined}
          flexWrap='nowrap'
        >
          <Grid
            container
            item
            xs
            justifyContent='space-around'
            flexDirection='column'
          >
            <Typography
              variant='h5'
              aria-owns={titleOpen ? "mouse-over-title-popover" : undefined}
              aria-haspopup='true'
              onMouseEnter={handleTitlePopoverOpen}
              onMouseLeave={handleTitlePopoverClose}
              sx={{
                whiteSpace: "nowrap",
                width: xsMatches ? undefined : "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {carSpace.title}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              aria-owns={open ? "mouse-over-address-popover" : undefined}
              aria-haspopup='true'
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              sx={{
                whiteSpace: "nowrap",
                width: xsMatches ? undefined : "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {carSpace.address}
            </Typography>
            <Stack
              direction='row'
              spacing={1}
              flexWrap='wrap'
              sx={{
                width: xsMatches ? undefined : "150px",
                overflow: "hidden",
              }}
            >
              {carSpace.amenities
                ?.split(",")
                .slice(0, 2)
                .map((amenity, index) => (
                  <Chip key={index} label={amenity} size='small' />
                ))}
            </Stack>
            <Stack direction='row' spacing={2}>
              <Typography variant='caption'>
                {carSpace.distance?.toFixed(2) || 0}km
              </Typography>
              <Typography
                variant='caption'
                sx={{ maxWidth: xsMatches ? undefined : 90 }}
              >
                <LocalParkingIcon fontSize='inherit' />
                {carSpace.car_space_type || "Undercover"}
              </Typography>
            </Stack>
          </Grid>
          <Grid
            item
            container
            flexDirection='column'
            justifyContent='space-around'
            alignItems='center'
            spacing={1}
            xs
            flexWrap='nowrap'
          >
            <Stack
              direction={xsMatches ? "row" : "column"}
              sx={{ width: "100%" }}
              justifyContent={xsMatches ? "space-around" : undefined}
              alignItems='center'
            >
              <Box>
                <PriceTag
                  price={getPrice(priceType)}
                  discount={getDiscountRate(
                    first_timer,
                    carSpace.provider.discount_rate ?? 0
                  )}
                />
              </Box>
              <Box>
                <Typography component='span' variant='subtitle2'>
                  per
                </Typography>
                <DropdownMenu text={priceType} menuList={menuList} />
              </Box>
            </Stack>
            <Button
              variant='outlined'
              href={`/car-space-detail/${carSpace.id}`}
              sx={{ width: xsMatches ? "100%" : undefined }}
            >
              More Details
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Popover
        id='mouse-over-title-popover'
        sx={{
          pointerEvents: "none",
        }}
        open={titleOpen}
        anchorEl={titleAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handleTitlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{carSpace.title}</Typography>
      </Popover>
      <Popover
        id='mouse-over-address-popover'
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>{carSpace.address}</Typography>
      </Popover>
    </>
  );
};

export default CarSpaceListItem;
