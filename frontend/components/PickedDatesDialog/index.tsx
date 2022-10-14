import { Dialog, DialogTitle, DialogContent, Box, Chip } from "@mui/material";

interface PickedDatesDialogProps {
  dates: Date[];
  open: boolean;
  handleClose: () => void;
}

const PickedDatesDialog: React.FC<PickedDatesDialogProps> = (props) => {
  const { open, handleClose, dates } = props;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Picked dates</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 0.5,
            m: 0,
            maxHeight: 300,
            overflowY: "auto",
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
      </DialogContent>
    </Dialog>
  );
};

export default PickedDatesDialog;
