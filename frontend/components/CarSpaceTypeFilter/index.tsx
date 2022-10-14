import { Dispatch, SetStateAction, useCallback, useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Popover,
  Stack,
} from "@mui/material";
import { Query } from "pages";
import { CarSpaceType } from "models/CarSpace";

interface CarSpaceTypeFilterProps {
  id: string;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
  setQuery: Dispatch<SetStateAction<Query>>;
}

const CarSpaceTypeFilter: React.FC<CarSpaceTypeFilterProps> = (props) => {
  const { open, anchorEl, setAnchorEl, setQuery } = props;
  const [carSpaceType, setCarSpaceType] = useState<CarSpaceType[]>([]);
  const handleClose = () => {
    setAnchorEl(null);
    setCarSpaceType([]);
  };
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
  const handleConfirm = useCallback(() => {
    setQuery((q) => ({
      ...q,
      cs_type: carSpaceType.map((t) => t.toLowerCase()).join(","),
    }));
    setAnchorEl(null);
    setCarSpaceType([]);
  }, [carSpaceType, setAnchorEl, setQuery]);
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
      <Stack sx={{ width: 200, p: 2 }} spacing={2}>
        <FormGroup row>
          {(Object.keys(CarSpaceType) as Array<keyof typeof CarSpaceType>).map(
            (item, index) => (
              <FormControlLabel
                key={index}
                control={<Checkbox />}
                label={item}
                value={CarSpaceType[item]}
                onChange={handleCheck}
              />
            )
          )}
        </FormGroup>
        <Button variant='outlined' onClick={handleConfirm}>
          Confirm
        </Button>
      </Stack>
    </Popover>
  );
};

export default CarSpaceTypeFilter;
