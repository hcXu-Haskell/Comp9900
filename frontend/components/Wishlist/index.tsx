import { useState, useCallback } from "react";
import { Button, Stack, Typography } from "@mui/material";
// internal
import Wishlist from "models/Wishlist";
import WishlistItemCard from "components/WishlistItemCard";
import CreateWishlistItemDialog from "components/CreateWishlistItemDialog";
import { CarSpaceType, PriceType, VehicleType } from "models/CarSpace";
import { CreateWishlistItemFormData } from "models/Wishlist";
import useApplicationContext from "hooks/useApplicationContext";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import { Method } from "axios";
import _ from "lodash";

const Wishlist: React.FC = () => {
  const { reportMessage, user, requestUser } = useApplicationContext();
  const [open, setDialogOpen] = useState(false);
  const handleClickOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };
  const defaultFormData = {
    min_price: 0,
    max_price: 0,
    price_type: "Month" as PriceType,

    address_id: "",
    address: "",
    latitude: -1,
    longitude: -1,

    distance: 0,
    car_space_types: [CarSpaceType.Indoor].join(","),
    max_allowed_vehicle: VehicleType.Hatch,
  };

  const [formData, setFormData] =
    useState<CreateWishlistItemFormData>(defaultFormData);

  const [setRequestCreateWishlistItem] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: () => {
      handleClose();
      reportMessage("You have successfully create a wishlist item", "success");
      requestUser();
    },
  });

  const [setRequestDeleteWishlistItem] = useAuthedApiCall({
    requestInfo: {} as any,
    callbackAfter: requestUser,
  });
  const handleDelete = useCallback(
    (item: Wishlist) => {
      setRequestDeleteWishlistItem({
        method: "delete" as Method,
        url: `/wishlist/${item.id}`,
      });
    },
    [setRequestDeleteWishlistItem]
  );

  const handleCreateWishlistItem = useCallback(() => {
    if (formData.min_price === 0 || formData.max_price === 0) {
      reportMessage("Price can not be 0", "warning");
      return;
    }
    if (formData.address_id === "") {
      reportMessage("Please pick a location", "warning");
      return;
    }
    if (formData.distance === 0) {
      reportMessage("Distance can not be 0", "warning");
      return;
    }
    setRequestCreateWishlistItem({
      method: "post" as Method,
      url: "/wishlist",
      data: formData,
    });
  }, [formData, reportMessage, setRequestCreateWishlistItem]);
  return (
    <Stack spacing={3}>
      <Typography variant='h5'>Wishlist</Typography>
      <Stack spacing={2}>
        {user?.wishlist?.map((w) => (
          <WishlistItemCard key={w.id} item={w} handleDelete={handleDelete} />
        ))}
      </Stack>
      <Button onClick={handleClickOpen}>Create new wishlist item</Button>
      <CreateWishlistItemDialog
        open={open}
        handleClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        handleCreateWishlistItem={handleCreateWishlistItem}
      />
    </Stack>
  );
};

export default Wishlist;
