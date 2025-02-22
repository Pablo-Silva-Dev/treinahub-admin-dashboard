/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASEURL: string;
  readonly VITE_STORAGE_LIMIT_BRONZE_PLAN: number;
  readonly VITE_STORAGE_LIMIT_SILVER_PLAN: number;
  readonly VITE_STORAGE_LIMIT_GOLD_PLAN: number;
  readonly VITE_FREE_EMPLOYEES_LIMIT_BRONZE_PLAN: number;
  readonly VITE_FREE_EMPLOYEES_LIMIT_SILVER_PLAN: number;
  readonly VITE_FREE_EMPLOYEES_LIMIT_GOLD_PLAN: number;
  readonly VITE_STRIPE_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
