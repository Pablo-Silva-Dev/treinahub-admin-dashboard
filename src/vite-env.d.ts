/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASEURL: string;
  readonly VITE_MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN: number;
  readonly VITE_MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN: number;
  readonly VITE_MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN: number;
  readonly VITE_MAX_VIDEO_CLASSES_BY_TRAINING_CREATION_ALLOWED_GOLD_PLAN: number;
  readonly VITE_MAX_VIDEO_CLASSES_BY_TRAINING_CREATION_ALLOWED_PLATINUM_PLAN: number;
  readonly VITE_MAX_VIDEO_CLASSES_BY_TRAINING_CREATION_ALLOWED_DIAMOND_PLAN: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
