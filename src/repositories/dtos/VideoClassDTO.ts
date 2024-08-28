import { ITrainingDTO } from "./TrainingDTO";

export interface IVideoClassDTO {
  id: string;
  name: string;
  description: string;
  duration: number;
  video_url?: string;
  thumbnail_url?: string;
  training_id: string;
  training_name: string;
  training?: ITrainingDTO;
  formatted_duration?: string;
  hls_encoding_id: string;
  dash_encoding_id: string;
  hls_encoding_url: string;
  dash_encoding_url: string;
}
