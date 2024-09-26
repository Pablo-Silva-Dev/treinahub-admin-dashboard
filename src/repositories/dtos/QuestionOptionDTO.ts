import { IQuizResponseDTO } from "./QuizResponseDTO";

export interface IQuestionOptionDTO {
  id: string;
  question_id: string;
  content: string;
  quiz_responses?: IQuizResponseDTO[];
  is_correct: boolean;
}

export interface ICreateQuestionOptionDTO {
  question_id: string;
  content: string;
  is_correct: boolean;
}
