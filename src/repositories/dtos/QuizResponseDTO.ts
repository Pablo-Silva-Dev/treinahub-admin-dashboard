import { IQuestionOptionDTO } from "./QuestionOptionDTO";

export interface IQuizResponseDTO {
  id: string;
  quiz_attempt_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
  correct_option?: IQuestionOptionDTO;
}

export interface ICreateQuizResponseDTO {
  quiz_attempt_id: string;
  question_id: string;
  selected_option_id: string;
}
