import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateQuestionOptionDTO,
  IQuestionOptionDTO,
} from "./dtos/QuestionOptionDTO";
import { IQuestionOptionsRepository } from "./interfaces/questionOptionsRepository";

export class QuestionOptionsRepository implements IQuestionOptionsRepository {
  async createQuestionOption(
    data: ICreateQuestionOptionDTO
  ): Promise<IQuestionOptionDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuestionOptionDTO>>(
        "/question-options/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listQuestionOptionByQuizQuestion(
    quizQuestionId: string
  ): Promise<IQuestionOptionDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuestionOptionDTO[]>>(
        `/question-options/list-by-quiz-question/${quizQuestionId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getQuestionOptionById(
    questionOptionId: string
  ): Promise<IQuestionOptionDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuestionOptionDTO>>(
        `/question-options/get-by-id/${questionOptionId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteQuestionOption(questionOptionId: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/question-options/delete/${questionOptionId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
