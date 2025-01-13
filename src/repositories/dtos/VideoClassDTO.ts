import { ITrainingDTO } from "./TrainingDTO";

export interface IVideoClassDTO {
  id: string;
  name: string;
  description: string;
  duration: number;
  video_url: string;
  training_id: string;
  training_name: string;
  training?: ITrainingDTO;
  formatted_duration?: string;
  status?: "CONVERTED" | "CONVERTING" | "FAILED";
  thumbnail_url?: string;
  storage_size: number;
}

export interface ICreateVideoClassDTO {
  name: string;
  description: string;
  training_id: string;
  video_file: Blob;
}

export interface IUpdateVideoClassDTO {
  id: string;
  name?: string;
  description?: string;
  training_id: string;
}
