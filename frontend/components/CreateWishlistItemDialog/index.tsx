import {
  Dispatch,
  SetStateAction,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Stack,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
  Box,
  Input,
  Typography,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import DropdownMenu from "components/DropdownMenu";
import { CarSpaceType, PriceType, VehicleType } from "models/CarSpace";
import { CreateWishlistItemFormData } from "models/Wishlist";
import AddressSearch, { Address } from "components/AddressSearch";

export interface CreateWishlistItemDialogProps {
  open: boolean;
  handleClose: () => void;
  formData: CreateWishlistItemFormData;
  setFormData: Dispatch<SetStateAction<CreateWishlistItemFormData>>;
  handleCreateWishlistItem: () => void;
}
const CreateWishlistItemDialog: React.FC<CreateWishlistItemDialogProps> = (
  props
) => {
  const { open, handleClose, formData, setFormData, handleCreateWishlistItem } =
    props;

  const handleChangePriceType = useCallback(
    (type: PriceType) => (e: React.MouseEvent) => {
      setFormData((d) => ({ ...d, price_type: type }));
    },
    [setFormData]
  );
  const [searchValue, setSearchValue] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<
    Address | string | null
  >(null);
  const [carSpaceType, setCarSpaceType] = useState<CarSpaceType[]>([]);
  const handleCheck = useCallback(
    (event: any) => {
      let updatedList = [...carSpaceType];
      if (event.target.checked) {
        updatedList = [...carSpaceType, event.target.value];
      } else {
        updatedList.splice(carSpaceType.indexOf(event.target.value), 1);
      }
      setCarSpaceType(updatedList);
    },
    [carSpaceType]
  );

  useEffect(() => {
    if (carSpaceType) {
      setFormData((d) => ({ ...d, car_space_types: carSpaceType.join(",") }));
    }
  }, [carSpaceType, setFormData]);

  useEffect(() => {
    if (selectedAddress && typeof selectedAddress !== "string") {
      setFormData((d) => ({
        ...d,
        address_id: selectedAddress.id as string,
        address: selectedAddress.address,
        latitude: selectedAddress.latitude,
        longitude: selectedAddress.longitude,
      }));
    }
  }, [selectedAddress, setFormData]);
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
    [handleChangePriceType]
  );
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create New Wishlist Item</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Make your wish for preferred car spaces, you will be notified when a
          satisfactory car space is posted.
        </DialogContentText>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant='subtitle2'>Price Range</Typography>
          <FormControl required>
            <InputLabel htmlFor='min-price'>Min Price</InputLabel>
            <Input
              type='number'
              name='minPrice'
              id='min-price'
              value={formData.min_price}
              onChange={(e) =>
                setFormData((d) => ({
                  ...d,
                  min_price: Number(e.target.value),
                }))
              }
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
              value={formData.max_price}
              onChange={(e) =>
                setFormData((d) => ({
                  ...d,
                  max_price: Number(e.target.value),
                }))
              }
              startAdornment={
                <InputAdornment position='start'>A$</InputAdornment>
              }
            />
          </FormControl>
          <Box sx={{ textAlign: "center" }}>
            <Typography component='span' variant='subtitle2'>
              per
            </Typography>
            <DropdownMenu text={formData.price_type} menuList={menuList} />
          </Box>
          <Typography variant='subtitle2'>Location</Typography>
          <AddressSearch
            renderInput={(params) => (
              <TextField
                variant='standard'
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
          />
          <FormControl required>
            <InputLabel htmlFor='min-price'>Max Distance</InputLabel>
            <Input
              type='number'
              name='minPrice'
              id='min-price'
              value={formData.distance}
              onChange={(e) =>
                setFormData((d) => ({ ...d, distance: Number(e.target.value) }))
              }
              endAdornment={<InputAdornment position='end'>km</InputAdornment>}
            />
          </FormControl>
          <FormControl fullWidth required variant='standard'>
            <InputLabel>Max Allowed Vehicle</InputLabel>
            <Select
              id='max_vehicle'
              name='max_vehicle'
              label='Max Allowed Vehicle'
              value={formData.max_allowed_vehicle}
              onChange={(event) => {
                setFormData((d) => ({
                  ...d,
                  max_allowed_vehicle: event.target.value as VehicleType,
                }));
              }}
            >
              {(
                Object.keys(VehicleType) as Array<keyof typeof VehicleType>
              ).map((item, index) => (
                <MenuItem key={index} value={item}>
                  {VehicleType[item]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant='subtitle2'>Car Space Type</Typography>
          <FormGroup row>
            {(
              Object.keys(CarSpaceType) as Array<keyof typeof CarSpaceType>
            ).map((item, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                label={item}
                value={CarSpaceType[item]}
                onChange={handleCheck}
              />
            ))}
          </FormGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleCreateWishlistItem}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWishlistItemDialog;
