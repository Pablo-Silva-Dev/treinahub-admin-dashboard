import { ICertificateDTO } from "../dtos/CertificateDTO";
import { ITrainingMetricsDTO } from "../dtos/TrainingMetricDTO";
import { IUserDTO } from "../dtos/UserDTO";
import { IVideoClassDTO } from "../dtos/VideoClassDTO";

export interface ITrainingDTO {
    id: string;
    name: string;
    description: string;
    duration: number;
    cover_url?: string;
    formatted_duration?: string;
    users?: IUserDTO[];
    video_classes?: IVideoClassDTO[];
    certificates?: ICertificateDTO[];
    training_metrics?: ITrainingMetricsDTO[];
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
  