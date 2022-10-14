import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import DropdownMenu from "components/DropdownMenu";
import { PriceType } from "models/CarSpace";
import useApplicationContext from "hooks/useApplicationContext";
import { Query } from "pages";

interface PriceFilterProps {
  id: string;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  setQuery: Dispatch<SetStateAction<Query>>;
}

const PriceFilter: React.FC<PriceFilterProps> = (props) => {
  const { reportMessage } = useApplicationContext();
  const { open, anchorEl, setAnchorEl, setQuery } = props;
  const [priceType, setPriceType] = useState<PriceType>("Month");
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
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const minPrice = data.get("minPrice") as FormDataEntryValue;
      const maxPrice = data.get("maxPrice") as FormDataEntryValue;
      if (Number(minPrice) > Number(maxPrice)) {
        reportMessage("Min price can not be bigger than max price.", "warning");
        return;
      }
      setQuery((q) => ({
        ...q,
        price: [minPrice, maxPrice, priceType.toLowerCase()].join(","),
      }));
      setAnchorEl(null);
    },
    [priceType, reportMessage, setAnchorEl, setQuery]
  );
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Stack
        sx={{ width: 250, p: 2 }}
        spacing={2}
        component='form'
        onSubmit={handleSubmit}
      >
        <Typography variant='subtitle2'>Price Range</Typography>
        <FormControl required>
          <InputLabel htmlFor='min-price'>Min Price</InputLabel>
          <Input
            type='number'
            name='minPrice'
            id='min-price'
            startAdornment={
              <InputAdornment position='start'>A$</InputAdornment>
            }
          />
        </FormControl>
        <FormControl required>
          <InputLabel htmlFor='max-price'>Max Price</InputLabel>
          <Input
            type='number'
            name='maxPrice'
            id='max-price'
            startAdornment={
              <InputAdornment position='start'>A$</InputAdornment>
            }
          />
        </FormControl>
        <Box sx={{ textAlign: "center" }}>
          <Typography component='span' variant='subtitle2'>
            per
          </Typography>
          <DropdownMenu text={priceType} menuList={menuList} />
        </Box>
        <Button variant='outlined' type='submit'>
          Confirm
        </Button>
      </Stack>
    </Popover>
  );
};

export default PriceFilter;
