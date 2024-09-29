import {
  ICreateQuestionOptionDTO,
  IQuestionOptionDTO,
} from "../dtos/QuestionOptionDTO";

export interface IQuestionOptionsRepository {
  createQuestionOption(
    data: ICreateQuestionOptionDTO
  ): Promise<IQuestionOptionDTO>;
  listQuestionOptionByQuizQuestion(
    quizQuestionId: string
  ): Promise<IQuestionOptionDTO[]>;
  getQuestionOptionById(
    quizQuestionId: string
  ): Promise<IQuestionOptionDTO | void>;
  deleteQuestionOption(quizQuestionId: string): Promise<void>;
}
