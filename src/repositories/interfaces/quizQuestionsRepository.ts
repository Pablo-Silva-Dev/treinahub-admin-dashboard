import {
  ICreateQuizQuestionDTO,
  IQuizQuestionDTO,
  IUpdateQuizQuestionDTO,
} from "../dtos/QuestionDTO";

export interface IQuizQuestionsRepository {
  createQuizQuestion(data: ICreateQuizQuestionDTO): Promise<IQuizQuestionDTO>;
  listQuizQuestionsByQuiz(quizId: string): Promise<IQuizQuestionDTO[]>;
  getQuizQuestionById(quizQuestionId: string): Promise<IQuizQuestionDTO | void>;
  updateQuizQuestion(data: IUpdateQuizQuestionDTO): Promise<IQuizQuestionDTO>;
  deleteQuizQuestion(quizQuestionId: string): Promise<void>;
}
