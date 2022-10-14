import { Backdrop, CircularProgress, Stack, Typography } from "@mui/material";
import useApplicationContext from "hooks/useApplicationContext";

const Loader: React.FC = () => {
  const { darkMode } = useApplicationContext();

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: darkMode ? "#fafafa" : "primary.dark",
      }}
      invisible={!darkMode}
      open={true}
    >
      <Stack spacing={1} alignItems='center'>
        <CircularProgress color='inherit' />
        <Typography color='inherit'>Loading...</Typography>
      </Stack>
    </Backdrop>
  );
};
export default Loader;
