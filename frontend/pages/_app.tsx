import "styles/globals.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import StoreProvider from "components/StoreProvider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_OPTIONS } from "utils/constants";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StoreProvider>
        <PayPalScriptProvider options={PAYPAL_OPTIONS}>
          <Component {...pageProps} />
        </PayPalScriptProvider>
      </StoreProvider>
    </LocalizationProvider>
  );
}

export default MyApp;
