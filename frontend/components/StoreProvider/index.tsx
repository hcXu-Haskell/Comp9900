import { createContext, useCallback, useEffect, useState } from "react";
import {
  Snackbar,
  Alert,
  AlertColor,
  Theme,
  ThemeProvider,
} from "@mui/material";
import useApplicationStates, {
  ApplicationStates,
  ColorMode,
} from "hooks/useApplicationStates";

export const StoreContext = createContext<
  ApplicationStates & {
    reportMessage: (message: string, severity: AlertColor) => void;
  }
>({
  token: "",
  setToken: () => {},
  reportMessage: () => {},
  isFetchingUser: false,
  requestUser: () => {},
  recentHistory: [],
  setRecentHistory: () => {},
  mode: ColorMode.LIGHT,
  setMode: () => {},
  darkMode: false,
  theme: {} as Theme,
});

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  // message box for fetch error
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);
  const reportMessage = useCallback((message: string, severity: AlertColor) => {
    setOpen(true);
    setMessage(message);
    setSeverity(severity);
  }, []);

  const states = useApplicationStates({ reportMessage });

  return (
    <StoreContext.Provider
      value={{
        ...states,
        reportMessage,
      }}
    >
      <ThemeProvider theme={states.theme}>
        {children}
        <Snackbar
          open={open}
          onClose={() => setOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setOpen(false)}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </StoreContext.Provider>
  );
};

export default StoreProvider;
