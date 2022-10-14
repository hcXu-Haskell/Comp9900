import axios, { AxiosRequestHeaders, Method } from "axios";
import { BASE_URL } from "utils/constants";
import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { errorHandler } from "utils/error";
import useApplicationContext from "./useApplicationContext";

export interface IRequestInfo {
  headers?: AxiosRequestHeaders;
  method: Method;
  url: string;
  data?: object;
}

const myAxios = axios.create({
  baseURL: BASE_URL,
});

const useAuthedApiCall = <T>(props: {
  requireAuth?: boolean;
  adminToken?: string;
  requestInfo: IRequestInfo;
  callbackBefore?: () => void;
  callbackAfter?: (data: T) => void;
}): [
  Dispatch<SetStateAction<IRequestInfo>>,
  boolean,
  T | undefined,
  Dispatch<SetStateAction<T | undefined>>,
  () => void
] => {
  const { reportMessage } = useApplicationContext();
  const {
    callbackAfter,
    callbackBefore,
    requireAuth = true,
    adminToken,
  } = props;
  const [isFetching, setIsFetching] = useState(false);
  const [requestInfo, setRequest] = useState(props.requestInfo);
  const [response, setResponse] = useState<T>();
  const [update, setUpdate] = useState(false);

  const request = () => {
    setUpdate((update) => !update);
  };

  const fetch = useCallback(async () => {
    if (
      Object.keys(requestInfo).length === 0 &&
      requestInfo.constructor === Object
    ) {
      return;
    }
    const { headers, method, url, data } = requestInfo;
    const token = localStorage.getItem("token");
    if (callbackBefore) {
      callbackBefore();
    }
    setIsFetching(true);
    try {
      const res = await myAxios({
        method,
        url,
        data,
        headers: {
          ...headers,
          Authorization: requireAuth ? "Bearer " + (adminToken || token) : "",
        },
      });
      setResponse(res.data);
      if (callbackAfter) {
        callbackAfter(res.data);
      }
    } catch (error) {
      errorHandler(error, (message) => reportMessage(message, "error"));
    }
    setIsFetching(false);
  }, [
    adminToken,
    callbackAfter,
    callbackBefore,
    reportMessage,
    requestInfo,
    requireAuth,
  ]);

  const authFetch = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      (localStorage.getItem("token") || localStorage.getItem("adminToken"))
    ) {
      fetch();
    }
  }, [fetch]);

  useEffect(() => {
    if (requireAuth) {
      authFetch();
    } else {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [update, requestInfo]);

  return [setRequest, isFetching, response, setResponse, request];
};

export default useAuthedApiCall;
