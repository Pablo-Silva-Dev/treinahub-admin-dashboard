import { useAuthenticationStore } from "@/store/auth";
import { showAlertError } from "@/utils/alerts";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL,
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
  const { user } = useAuthenticationStore.getState();
  const token = user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.log(`[${config.method?.toUpperCase()}] - ${config.url}`);
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<IApiSuccessResponse<any>>) => {
    if (import.meta.env.DEV) {
      console.log("[RESPONSE SUCCESS] - ", response.data);
    }
    return response;
  },
  (error: AxiosError<IApiErrorResponse>) => {
    if (error.response?.status === 429) {
      showAlertError(
        "Houve um erro ao tentar realizar sua solicitação. Por favor tente novamente dentro de 1 minuto."
      );
    }
    if (error.response) {
      if (import.meta.env.DEV) {
        console.log("[RESPONSE ERROR] - ", error.response.data);
        return Promise.reject(error.response.data);
      }
      const safeError = {
        STATUS: error.response?.status ?? 500,
        MESSAGE: "Ocorreu um erro ao processar sua solicitação.",
        DATA: null,
      };
      return Promise.reject(safeError);
    }
    if (error.request) {
      if (import.meta.env.DEV) {
        console.log("[REQUEST ERROR] - ", error.request.data);
        return Promise.reject(error.request.data);
      }
    }
  }
);
