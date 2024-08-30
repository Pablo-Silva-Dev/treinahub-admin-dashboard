import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateFaqQuestionDTO,
  IFaqQuestionDTO,
  IUpdateFaqQuestionDTO,
} from "./dtos/FaqQuestionDTO";
import { IFaqQuestionsRepository } from "./interfaces/faqQuestionsRepository";

export class FaqQuestionsRepository implements IFaqQuestionsRepository {
  async createFaqQuestion(
    data: ICreateFaqQuestionDTO
  ): Promise<IFaqQuestionDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IFaqQuestionDTO>>(
        "/faq-questions/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listFaqQuestions(): Promise<IFaqQuestionDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IFaqQuestionDTO[]>>(
        "/faq-questions/list"
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getFaqQuestionById(faqQuestionId: string): Promise<IFaqQuestionDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IFaqQuestionDTO>>(
        `faq-questions/get-by-id/${faqQuestionId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateFaqQuestion(
    data: IUpdateFaqQuestionDTO
  ): Promise<IFaqQuestionDTO> {
    try {
      const response = await api.put<IApiSuccessResponse<IFaqQuestionDTO>>(
        "/faq-questions/update",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteFaqQuestion(faqQuestionId: string): Promise<void> {
    try {
      await api.delete<IApiSuccessResponse<void>>(
        `/faq-questions/delete/${faqQuestionId}`
      );
    } catch (error) {
      throw error;
    }
  }
}
