import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Popover,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import KeyIcon from "@mui/icons-material/Key";
import Booking, { BookingStatus } from "models/Booking";
import CarSpaceImage from "components/CarSpaceImage";
import CarSpace from "models/CarSpace";

interface BookingListItemProps {
  booking: Booking;
  handleDelete?: (booking: Booking) => void;
  onClickPrice: () => void;
  isAdmin?: boolean;
  showCustomer?: boolean;
  showProvider?: boolean;
  showViewBooking?: boolean;
}

const BookingListItem: React.FC<BookingListItemProps> = (props) => {
  const {
    booking,
    handleDelete,
    onClickPrice,
    isAdmin = false,
    showCustomer = false,
    showProvider = false,
    showViewBooking = true,
  } = props;
  const carSpace = useMemo(
    () => JSON.parse(booking.car_space_snapshot),
    [booking.car_space_snapshot]
  ) as CarSpace;

  const theme = useTheme();
  const mdMatches = useMediaQuery(theme.breakpoints.up("md"));
  const xsMatches = useMediaQuery(theme.breakpoints.down("sm"));
  // address popover control
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (xsMatches) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  // title popover control
  const [titleAnchorEl, setTitleAnchorEl] = useState<HTMLElement | null>(null);
  const handleTitlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (xsMatches) {
      setTitleAnchorEl(event.currentTarget);
    }
  };
  const handleTitlePopoverClose = () => {
    setTitleAnchorEl(null);
  };
  const titleOpen = Boolean(titleAnchorEl);
  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.PENDING:
        return "warning";
      case BookingStatus.PAID:
        return "success";
      case BookingStatus.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  return carSpace ? (
    <>
      <Card
        sx={{ display: "flex", flexDirection: mdMatches ? "row" : "column" }}
      >
        <CarSpaceImage
          src={carSpace.image}
          height={150}
          width={150}
          objectFit={mdMatches && !carSpace.image ? "cover" : "contain"}
        />
        <CardContent
          sx={{
            display: "flex",
            flexGrow: 1,
            gap: 1,
            flexDirection: mdMatches ? "row" : "column",
          }}
        >
          <Stack justifyContent='space-between' flexGrow={1} spacing={1}>
            <Typography
              variant='subtitle2'
              aria-owns={titleOpen ? "mouse-over-title-popover" : undefined}
              aria-haspopup='true'
              onMouseEnter={handleTitlePopoverOpen}
              onMouseLeave={handleTitlePopoverClose}
              sx={
                xsMatches
                  ? {
                      whiteSpace: "nowrap",
                      width: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }
                  : undefined
              }
            >
              {carSpace.title}
            </Typography>
            <Typography
              variant='subtitle1'
              color='text.secondary'
              aria-owns={open ? "mouse-over-popover" : undefined}
              aria-haspopup='true'
              onMouseEnter={mdMatches ? undefined : handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              sx={
                xsMatches
                  ? {
                      whiteSpace: "nowrap",
                      width: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }
                  : undefined
              }
            >
              {carSpace.address}
            </Typography>
            <Stack direction='row' spacing={1}>
              {carSpace.amenities
                ?.split(",")
                .slice(0, 2)
                .map((amenity, index) => (
                  <Chip key={index} label={amenity} size='small' />
                ))}
            </Stack>
            <Stack direction='row' spacing={1}>
              <Typography variant='caption'>
                <LocalParkingIcon fontSize='inherit' />
                {carSpace.car_space_type || "Undercover"}
              </Typography>
              <Typography variant='caption'>
                <KeyIcon fontSize='inherit' />
                {carSpace.access_type || "None"}
              </Typography>
            </Stack>
            {showCustomer && (
              <Typography variant='caption'>
                Customer: {booking.customer?.name}
              </Typography>
            )}
            {showProvider && (
              <Typography variant='caption'>
                Provider: {carSpace.provider?.name}
              </Typography>
            )}
          </Stack>
          <Stack
            alignItems={mdMatches ? "flex-start" : "center"}
            sx={{ minWidth: 150 }}
            direction={mdMatches ? "column" : "row"}
            spacing={2}
          >
            <Link href={`/car-space-detail/${carSpace.id}`} passHref>
              <Tooltip
                placement='top'
                title='You will be reviewing the latest information of the car space'
              >
                <Button size='small'>View Space</Button>
              </Tooltip>
            </Link>
            {showViewBooking && (
              <Link href={`/view-booking/${booking.id}`} passHref>
                <Button size='small'>View Booking</Button>
              </Link>
            )}
            {isAdmin && handleDelete && (
              <Button size='small' onClick={() => handleDelete(booking)}>
                Delete
              </Button>
            )}
            <Chip
              label={booking.status}
              color={getStatusColor(booking.status)}
            />
          </Stack>
          <Stack
            sx={{ justifyContent: "space-around", alignItems: "center" }}
            direction={mdMatches ? "column" : "row"}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
              {new Date(booking.start_date).toLocaleDateString("en-au")}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem" }}>to</Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
              {new Date(booking.end_date).toLocaleDateString("en-au")}
            </Typography>
            <Tooltip title='Click to check picked dates' placement='top'>
              <Typography
                variant='subtitle1'
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.main",
                  },
                }}
                onClick={onClickPrice}
              >
                A${booking.price.toFixed(2)}
              </Typography>
            </Tooltip>
          </Stack>
        </CardContent>
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
        id='mouse-over-popover'
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
  ) : (
    <></>
  );
};

export default BookingListItem;
