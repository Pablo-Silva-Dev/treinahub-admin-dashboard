/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_STAGE_BASEURL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
