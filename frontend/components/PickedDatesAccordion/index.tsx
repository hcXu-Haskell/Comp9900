import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Chip,
} from "@mui/material";

interface PickedDatesAccordionProps {
  dates: Date[];
}

const PickedDatesAccordion: React.FC<PickedDatesAccordionProps> = (props) => {
  const { dates } = props;
  const [expanded, setExpanded] = useState(false);
  const handleAccordionChange = (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
  };
  return (
    <Accordion expanded={expanded} onChange={handleAccordionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>Your current picked dates</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: "400px", overflowY: "scroll" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 0.5,
            m: 0,
          }}
        >
          {dates.map((d, i) => (
            <Chip
              key={i}
              label={d.toLocaleDateString("en-au", {
                dateStyle: "full",
              })}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
export default PickedDatesAccordion;
