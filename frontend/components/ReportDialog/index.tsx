import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { Method } from "axios";
import { IRequestInfo } from "hooks/useAuthedApiCall";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ReportDialogProps {
  open: boolean;
  bookingId: string;
  handleClose: () => void;
  setRequestReport: Dispatch<SetStateAction<IRequestInfo>>;
}
const ReportDialog: React.FC<ReportDialogProps> = (props) => {
  const { open, bookingId, handleClose, setRequestReport } = props;

  const handleReport = () => {
    setRequestReport({
      method: "post" as Method,
      url: `bookings/${bookingId}/report-problem`,
      data: {
        content,
      },
    });
  };

  const [content, setContent] = useState("");
  return (
    <Dialog open={open} onClose={handleClose} maxWidth='xs'>
      <DialogTitle>Please report the problem here</DialogTitle>
      <DialogContent>
        <TextField
          id='outlined-multiline-static'
          label='Report'
          multiline
          rows={4}
          sx={{ mt: 1 }}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='error'>
          Cancel
        </Button>
        <Button onClick={handleReport}>Send</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDialog;
