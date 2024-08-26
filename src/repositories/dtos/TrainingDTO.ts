import { ICertificateDTO } from "./CertificateDTO";
import { ITrainingMetricsDTO } from "./TrainingMetricDTO";
import { IUserDTO } from "./UserDTO";
import { IVideoClassDTO } from "./VideoClassDTO";

export interface ITrainingDTO {
  id: string;
  name: string;
  description: string;
  duration: number;
  cover_url?: string;
  users?: IUserDTO[];
  video_classes?: IVideoClassDTO[];
  certificates?: ICertificateDTO[];
  training_metrics?: ITrainingMetricsDTO[];
  formatted_duration?: string;
}

export interface ICreateTrainingDTO {
  name: string;
  description: string;
  cover_url?: string;
}

export interface IUpdateTrainingDTO {
  id: string;
  name?: string;
  description?: string;
  cover_url?: string;
}
