import { ITrainingDTO } from "./TrainingDTO";
import { IUserDTO } from "./UserDTO";

export interface ICertificateDTO {
  id: string;
  user_id: string;
  training_id: string;
  url: string;
  created_at: Date;
  user?: IUserDTO;
  training?: ITrainingDTO;
}
