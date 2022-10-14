import { Chip, Typography } from "@mui/material";

interface countdownProps {
  minutes: number;
  seconds: number;
  completed: boolean;
}

const CountdownChip = (Props: countdownProps) => {
  if (!Props.completed) {
    return (
      <Chip
        label={
          <Typography variant='h6'>
            {Props.minutes}:{Props.seconds}
          </Typography>
        }
        color='primary'
      />
    );
  }
};

export default CountdownChip;
