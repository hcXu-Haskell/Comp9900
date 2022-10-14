import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Popover,
  Stack,
} from "@mui/material";
import { Query } from "pages";
import useApplicationContext from "hooks/useApplicationContext";

interface DistanceFilterProps {
  id: string;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  query: Query;
  setQuery: Dispatch<SetStateAction<Query>>;
}

const DistanceFilter: React.FC<DistanceFilterProps> = (props) => {
  const { reportMessage } = useApplicationContext();
  const { open, anchorEl, setAnchorEl, query, setQuery } = props;
  const [distance, setDistance] = useState<number>(query.distance);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleConfirm = useCallback(() => {
    if (distance === 0) {
      reportMessage("Distance cannot be 0", "warning");
      return;
    }
    setQuery((q) => ({ ...q, distance }));
    setAnchorEl(null);
  }, [distance, reportMessage, setAnchorEl, setQuery]);
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
      <Stack sx={{ width: 150, p: 2 }} spacing={2}>
        <FormControl required>
          <InputLabel htmlFor='min-price'>Max Distance</InputLabel>
          <Input
            type='number'
            name='minPrice'
            id='min-price'
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            inputProps={{ min: 1 }}
            endAdornment={<InputAdornment position='end'>km</InputAdornment>}
          />
        </FormControl>
        <Button variant='outlined' onClick={handleConfirm}>
          Confirm
        </Button>
      </Stack>
    </Popover>
  );
};

export default DistanceFilter;
