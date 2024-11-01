/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASEURL: string;
  readonly VITE_MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN: string;
  readonly VITE_MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN: string;
  readonly VITE_MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
