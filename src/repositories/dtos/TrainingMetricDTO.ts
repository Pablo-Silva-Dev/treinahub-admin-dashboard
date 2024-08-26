import { ITrainingDTO } from "./TrainingDTO";
import { IUserDTO } from "./UserDTO";

export interface ITrainingMetricsDTO {
  id: string;
  user_id: string;
  user?: IUserDTO;
  training_id: string;
  training?: ITrainingDTO;
  total_training_classes: number;
  total_watched_classes: number;
  total_watched_classes_percentage: number;
}

export interface ICreateITrainingMetricsDTO {
  user_id: string;
  training_id: string;
  total_training_classes: number;
  total_watched_classes: number;
  total_watched_classes_percentage: number;
}

export interface IGetTrainingMetricsDTO {
  user_id: string;
  training_id: string;
}

export interface IUpdateITrainingMetricsDTO {
  id: string;
  user_id: string;
  training_id: string;
  total_training_classes: number;
  total_watched_classes: number;
  total_watched_classes_percentage: number;
}
