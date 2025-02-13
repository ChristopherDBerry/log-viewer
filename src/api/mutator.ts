import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
const API_BASE_URL = import.meta.env.VITE_API_URL;


interface FetcherParams<T = unknown> {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  params?: Record<string, unknown>;
  data?: T;
  headers?: Record<string, string>;
}

export const customFetcher = async <T>({ url, method, params, data, headers }: FetcherParams): Promise<T> => {

  const fullUrl = `${API_BASE_URL}${url}`;

  const config: AxiosRequestConfig = {
    url: fullUrl,
    method,
    params,
    data,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      ...headers,
    },
  };

  const response: AxiosResponse<T> = await axios(config);
  return response.data;
};
