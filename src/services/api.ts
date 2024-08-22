import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_STAGE_BASEURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export interface IApiSuccessResponse<T> {
  RES: T;
  STATUS: number;
}

export interface IApiErrorResponse {
  RES: any;
  MSG: {
    message: string;
    error: string;
  };
  SUCCESS: boolean;
  TIMESTAMP: string;
  PATH: string;
  STATUS: number;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log(`[${config.method?.toUpperCase()}] - ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<IApiSuccessResponse<any>>) => {
    console.log("[RESPONSE SUCCESS] -", response.data);
    return response;
  },
  (error: AxiosError<IApiErrorResponse>) => {
    if (error.response) {
      console.log("[RESPONSE ERROR] - ", error.response.data);
      return Promise.reject(error.response.data);
    }
    if (error.request) {
      console.log("[RESPONSE ERROR] - ", error.request.data);
      return Promise.reject(error.request.data);
    }
  }
);
