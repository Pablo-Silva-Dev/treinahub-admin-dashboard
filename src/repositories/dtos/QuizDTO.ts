import { IQuizQuestionDTO } from "./QuestionDTO";
import { IQuizAttemptDTO } from "./QuizAttemptDTO";
import { ITrainingDTO } from "./TrainingDTO";

export interface IQuizDTO {
  id: string;
  training_id: string;
  question?: IQuizQuestionDTO[];
  quiz_attempts?: IQuizAttemptDTO[];
  training: ITrainingDTO;
}

export interface ICreateQuizDTO {
  training_id: never;
}
