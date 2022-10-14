import { Dispatch, SetStateAction, useState, useEffect } from "react";
// mui
import { AlertColor, createTheme, Theme } from "@mui/material";
// internal
import CarSpace from "models/CarSpace";
import useAuthedApiCall from "hooks/useAuthedApiCall";
import User from "models/User";
// third-party
import { Method } from "axios";
import SunCalc from "suncalc";

export enum ColorMode {
  LIGHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

export interface ApplicationStates {
  user?: User;
  isFetchingUser: boolean;
  requestUser: () => void;
  token?: string;
  setToken: (token: string) => void;
  recentHistory: HistoryItem[];
  setRecentHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  mode: ColorMode;
  setMode: (newMode: ColorMode) => void;
  darkMode: boolean;
  theme: Theme;
}

export type HistoryItem = Pick<CarSpace, "title" | "id">;

const useApplicationStates = ({
  reportMessage,
}: {
  reportMessage: (message: string, severity: AlertColor) => void;
}): ApplicationStates => {
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") as string;
    }
  };

  const [token, setToken] = useState(getToken());

  const _setToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      setToken(token);
    }
  };
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setRecentHistory(JSON.parse(localStorage.getItem("history") || "[]"));
  }, [setRecentHistory]);

  // get current user
  const [setRequestGetUser, isFetchingUser, user, setUser, requestUser] =
    useAuthedApiCall<User>({
      requestInfo: {} as any,
    });

  useEffect(() => {
    if (token) {
      setRequestGetUser({ method: "get" as Method, url: "/users/current" });
    }
  }, [setRequestGetUser, token]);

  const getMode = () => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("mode") as ColorMode) || ColorMode.LIGHT;
    }
    return ColorMode.LIGHT;
  };

  // user preference - store in localStorage and in context
  // when changed, need to trigger change to current mode
  const [mode, setMode] = useState(getMode());

  // current mode
  const [darkMode, setDarkMode] = useState(false);

  const _setMode = (newMode: ColorMode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mode", newMode);
      setMode(newMode);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      switch (mode) {
        case ColorMode.LIGHT:
          setDarkMode(false);
          break;
        case ColorMode.DARK:
          setDarkMode(true);
          break;
        case ColorMode.AUTO:
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
              const { sunrise, sunset } = SunCalc.getTimes(
                new Date(),
                position.coords.latitude,
                position.coords.longitude
              );
              const isNightTime = new Date() < sunrise || new Date() > sunset;
              setDarkMode(isNightTime);
              reportMessage(isNightTime ? "Night Time" : "Day Time", "info");
            });
          }
          break;
        default:
          console.log("wrong mode");
      }
    }
  }, [mode, reportMessage]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return {
    user,
    isFetchingUser,
    requestUser,
    token,
    setToken: _setToken,
    recentHistory,
    setRecentHistory,
    mode,
    setMode: _setMode,
    darkMode,
    theme,
  };
};

export default useApplicationStates;
