import { useState, useEffect, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

export function useApiCallback<T>(
  url: string,
  options?: AxiosRequestConfig,
  callback?: () => void,
): [
  () => void,
  {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    status: number | undefined;
  },
] {
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>();

  const fetchAPI = useCallback(async () => {
    setIsLoading(true);

    await axios<{ data: T }>(`${API_URL}/api${url}`, options)
      .then((res) => {
        setData(res.data.data);
        setStatus(res.status);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        setIsError(true);
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
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | undefined>();

  const fetchAPI = useCallback(async () => {
    setIsLoading(true);

    await axios<{ data: T }>(`${API_URL}/api${url}`, options)
      .then((res) => {
        setData(res.data.data);
        setStatus(res.status);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        setIsError(true);
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
    return () => {};
  }, []);

  return { data, isLoading, isError, error, status };
}
