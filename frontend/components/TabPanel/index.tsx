import { Box } from "@mui/material";
import { CSSProperties } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style?: CSSProperties;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`available-tabpanel-${index}`}
      aria-labelledby={`available-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, md: 3 } }}>{children}</Box>}
    </div>
  );
};

export const a11yProps = (index: number) => {
  return {
    id: `available-tab-${index}`,
    "aria-controls": `available-tabpanel-${index}`,
  };
};

export default TabPanel;
