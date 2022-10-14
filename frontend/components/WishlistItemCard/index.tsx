import { Button, Card, Stack, Typography, Chip } from "@mui/material";
import Wishlist from "models/Wishlist";

interface WishlistItemCardProps {
  item: Wishlist;
  handleDelete: (item: Wishlist) => void;
}

const WishlistItemCard: React.FC<WishlistItemCardProps> = (props) => {
  const { item, handleDelete } = props;

  return (
    <Card>
      <Stack direction='row' spacing={2} sx={{ m: 2 }}>
        <Stack flexGrow={1} spacing={1}>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Price Range:</Typography>
            <Typography>{`$${item.min_price} - $${item.max_price} per ${item.price_type}`}</Typography>
          </Stack>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Location:</Typography>
            <Typography>{item.address}</Typography>
          </Stack>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Distance Range:</Typography>
            <Typography>{item.distance} km</Typography>
          </Stack>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Max Allowed Vehicle:</Typography>
            <Typography>{item.max_allowed_vehicle}</Typography>
          </Stack>
          <Stack direction='row' spacing={2}>
            <Typography variant='subtitle2'>Car Space Type:</Typography>
            <Stack direction='row' spacing={1}>
              {item.car_space_types.split(",").map((t) => (
                <Chip key={t} label={t} />
              ))}
            </Stack>
          </Stack>
        </Stack>
        <Stack>
          <Button onClick={() => handleDelete(item)}>delete</Button>
        </Stack>
      </Stack>
    </Card>
  );
};

export default WishlistItemCard;
