import { IQuizDTO } from "./QuizDTO";

export interface IQuizQuestionDTO {
  id: string;
  quiz_id: string;
  content: string;
  options?: IQuizQuestionDTO[];
  quiz?: IQuizDTO;
  is_correct?: boolean;
}

export interface ICompleteQuizQuestionDTO {
  id: string;
  quiz_id: string;
  content: string;
  options: IQuizQuestionDTO[];
  quiz: IQuizDTO;
}

export interface ICreateQuizQuestionDTO {
  quiz_id: string;
  content: string;
}

export interface IUpdateQuizQuestionDTO {
  id: string;
  content?: string;
}
