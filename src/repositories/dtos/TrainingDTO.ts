import { ICertificateDTO } from "./CertificateDTO";
import { IQuizDTO } from "./QuizDTO";
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
  quizes?: IQuizDTO[];
  video_classes?: IVideoClassDTO[];
  certificates?: ICertificateDTO[];
  training_metrics?: ITrainingMetricsDTO[];
  formatted_duration?: string;
}
