import { IQuizQuestionDTO } from "./QuestionDTO";
import { IQuizAttemptDTO } from "./QuizAttemptDTO";

export interface IQuizDTO {
  id: string;
  training_id: string;
  question?: IQuizQuestionDTO[];
  quiz_attempts?: IQuizAttemptDTO[];
}

export interface ICreateQuizDTO {
  training_id: never;
}
