import { useState, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Popover,
  Stack,
  Switch,
  Typography,
  Chip,
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import KeyIcon from "@mui/icons-material/Key";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
// internal
import CarSpace from "models/CarSpace";
import CarSpaceImage from "components/CarSpaceImage";
import { IRequestInfo } from "hooks/useAuthedApiCall";
import { BookmarkType } from "pages/user-profile";
import LikeDislikeButtonGroup from "components/LikeDislikeButtonGroup";
// third-party
import { Method } from "axios";

interface CarSpaceListItemDashboardProps {
  carSpace: CarSpace;
  setRequestChangeCarSpaceStatus?: Dispatch<SetStateAction<IRequestInfo>>;
  handleDelete?: (cs: CarSpace) => void;
  isAdmin?: boolean;
  setRequestLikeDislikeCarSpace?: Dispatch<SetStateAction<IRequestInfo>>;
  bookmarkType?: BookmarkType;
}

const CarSpaceListItemDashboard: React.FC<CarSpaceListItemDashboardProps> = (
  props
) => {
  const {
    carSpace,
    setRequestChangeCarSpaceStatus,
    handleDelete,
    isAdmin = false,
    setRequestLikeDislikeCarSpace,
    bookmarkType,
  } = props;
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _checked = event.target.checked;
    if (setRequestChangeCarSpaceStatus) {
      if (_checked === false) {
        // unpublish
        setRequestChangeCarSpaceStatus({
          method: "put" as Method,
          url: `/car-spaces/${carSpace.id}/unpublish`,
        });
      } else {
        // publish
        setRequestChangeCarSpaceStatus({
          method: "put" as Method,
          url: `/car-spaces/${carSpace.id}/publish`,
        });
      }
    }
  };

  const isOnline = carSpace.status === "online";

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: mdMatches ? "row" : "column",
          opacity: isOnline || isAdmin ? 1 : 0.5,
        }}
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
            <Stack direction='row' spacing={2} alignItems='center'>
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
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }
                    : undefined
                }
              >
                {carSpace.title}
              </Typography>
              {setRequestChangeCarSpaceStatus &&
                carSpace.no_booking_past_six_months && (
                  <Tooltip
                    placement='top'
                    title='This car space has no booking'
                  >
                    <MoneyOffIcon fontSize='small' />
                  </Tooltip>
                )}
              {setRequestChangeCarSpaceStatus && carSpace.booking_count >= 1 && (
                <Tooltip
                  placement='top'
                  title={`This car space has ${carSpace.booking_count} booking${
                    carSpace.booking_count > 1 ? "s" : ""
                  }`}
                >
                  <LocalFireDepartmentIcon fontSize='small' color='error' />
                </Tooltip>
              )}
            </Stack>
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
            {isAdmin && handleDelete && (
              <Typography variant='caption'>
                Provider: {carSpace.provider?.name}
              </Typography>
            )}
          </Stack>
          <Stack
            justifyContent='space-around'
            alignItems={mdMatches ? "flex-start" : "center"}
            sx={{ minWidth: 150 }}
            direction={mdMatches ? "column" : "row"}
            spacing={2}
          >
            <Link
              href={`/car-space-detail/${carSpace.id}?jump=${encodeURIComponent(
                window.location.href
              )}`}
              passHref
            >
              <Button size='small'>More Detail</Button>
            </Link>
            {isAdmin && handleDelete ? (
              <>
                <Button size='small' onClick={() => handleDelete(carSpace)}>
                  Delete
                </Button>
                <Chip
                  label={carSpace.status}
                  color={carSpace.status === "online" ? "success" : "error"}
                />
              </>
            ) : (
              <>
                <Link
                  href={`/car-space-detail/${
                    carSpace.id
                  }/edit?jump=${encodeURIComponent(window.location.href)}`}
                  passHref
                >
                  <Button size='small'>Update</Button>
                </Link>
                {setRequestChangeCarSpaceStatus && (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isOnline}
                        onChange={handleChange}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    }
                    label={isOnline ? "Unpublish" : "Publish"}
                  />
                )}
                {setRequestLikeDislikeCarSpace && bookmarkType && (
                  <LikeDislikeButtonGroup
                    currentBookmarkType={bookmarkType}
                    setRequestLikeDislikeCarSpace={
                      setRequestLikeDislikeCarSpace
                    }
                    carSpaceId={carSpace.id}
                  />
                )}
              </>
            )}
          </Stack>
          <Stack
            justifyContent='space-around'
            direction={mdMatches ? "column" : "row"}
          >
            <Typography sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
              ${carSpace.price_per_month.toFixed(2)}/Month
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
              ${carSpace.price_per_week.toFixed(2)}/Week
            </Typography>
            <Typography sx={{ fontWeight: "bold", fontSize: "0.75rem" }}>
              ${carSpace.price_per_day.toFixed(2)}/Day
            </Typography>
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
  );
};

export default CarSpaceListItemDashboard;
