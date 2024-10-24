import { IQuizResponseDTO } from "./QuizResponseDTO";

export interface IQuizAttemptDTO {
  id: string;
  quiz_id: string;
  user_id: string;
  startedAt: Date;
  finishedAt?: Date;
  quiz_responses?: IQuizResponseDTO[];
}

export interface ICreateQuizAttemptDTO {
  quiz_id: string;
  user_id: string;
}
