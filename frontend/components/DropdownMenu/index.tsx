import Button, { ButtonProps } from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { useCallback, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface DropdownMenuProps {
  text: string;
  endIcon?: React.ReactNode;
  btnVariant?: ButtonProps["variant"];
  menuList: React.ReactNode[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = (props) => {
  const { text, btnVariant, menuList, endIcon } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Button
        id='dropdown-btn'
        aria-controls={open ? "dropdown-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={open ? "true" : undefined}
        variant={btnVariant}
        disableElevation
        onClick={handleClick}
        endIcon={endIcon || <KeyboardArrowDownIcon />}
      >
        {text}
      </Button>
      <Menu
        id='dropdown-menu'
        MenuListProps={{
          "aria-labelledby": "dropdown-btn",
        }}
        anchorEl={anchorEl}
        open={open}
        onClick={handleClose}
        onClose={handleClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {menuList}
      </Menu>
    </>
  );
};

export default DropdownMenu;
