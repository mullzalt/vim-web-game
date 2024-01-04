import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import Cookie from "js-cookie";

const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const reqIntercept = api.interceptors.request.use(
  (config) => {
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${Cookie.get("access_token")}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

const resIntercept = api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const prevRequest = error?.config;
    if (error?.response?.status === 401 && !prevRequest?.sent) {
      prevRequest.sent = true;
      const newAccessToken = await api
        .get(`/api/auth/refresh`, {
          withCredentials: true,
        })
        .then((res) => res.data?.access_token);
      prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(prevRequest);
    }
    return Promise.reject(error);
  },
);

export function useApiCallback<T>(
  url: string,
  options?: AxiosRequestConfig,
  callback?: () => void,
): [
  (args?: AxiosRequestConfig) => void,
  {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    status: number | undefined;
  },
] {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>();

  const fetchAPI = useCallback(async (args?: AxiosRequestConfig) => {
    setIsLoading(true);
    await api<{ data: T }>(`/api/${url}`, { ...options, ...args })
      .then((res) => {
        setData(res.data.data);
        setStatus(res.status);
      })
      .catch(async (err: AxiosError<{ message: string }>) => {
        setIsError(true);
        setIsLoading(false);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "something went wrong.",
        );
        setStatus(err?.response?.status);
      })
      .finally(() => {
        setIsLoading(false);
        callback && callback();
      });
  }, []);

  return [fetchAPI, { data, isLoading, isError, error, status }];
}

export function useApi<T>(url: string, options?: AxiosRequestConfig) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>();

  const fetchAPI = useCallback(async () => {
    setIsLoading(true);
    await api<{ data: T }>(`/api/${url}`, options)
      .then((res) => {
        setData(res.data.data);
        setStatus(res.status);
      })
      .catch(async (err: AxiosError<{ message: string }>) => {
        setIsError(true);
        setIsLoading(false);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "something went wrong.",
        );
        setStatus(err?.response?.status);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAPI();
    return () => {
      api.interceptors.request.eject(reqIntercept);
      api.interceptors.response.eject(resIntercept);
    };
  }, []);

  return { data, isLoading, isError, error, status, refetch: fetchAPI };
}
