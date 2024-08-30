import {
  ICreateFaqQuestionDTO,
  IFaqQuestionDTO,
  IUpdateFaqQuestionDTO,
} from "../dtos/FaqQuestionDTO";

export interface IFaqQuestionsRepository {
  createFaqQuestion(data: ICreateFaqQuestionDTO): Promise<IFaqQuestionDTO>;
  listFaqQuestions(): Promise<IFaqQuestionDTO[]>;
  getFaqQuestionById(faqQuestionId: string): Promise<IFaqQuestionDTO>;
  updateFaqQuestion(data: IUpdateFaqQuestionDTO): Promise<IFaqQuestionDTO>;
  deleteFaqQuestion(faqQuestionId: string): Promise<void>;
}
