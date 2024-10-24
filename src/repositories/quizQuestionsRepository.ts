import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateQuizQuestionDTO,
  IQuizQuestionDTO,
  IUpdateQuizQuestionDTO,
} from "./dtos/QuestionDTO";
import { IQuizQuestionsRepository } from "./interfaces/quizQuestionsRepository";

export class QuizQuestionsRepository implements IQuizQuestionsRepository {
  async createQuizQuestion(
    data: ICreateQuizQuestionDTO
  ): Promise<IQuizQuestionDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizQuestionDTO>>(
        "/quizzes-questions/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }

  async listQuizQuestionsByQuiz(quizId: string): Promise<IQuizQuestionDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizQuestionDTO[]>>(
        `/quizzes-questions/list-by-quiz/${quizId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getQuizQuestionById(quizQuestionId: string): Promise<IQuizQuestionDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizQuestionDTO>>(
        `/quizzes-questions/get-by-id/${quizQuestionId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateQuizQuestion(
    data: IUpdateQuizQuestionDTO
  ): Promise<IQuizQuestionDTO> {
    try {
      const response = await api.put<IApiSuccessResponse<IQuizQuestionDTO>>(
        "/quizzes-questions/update",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteQuizQuestion(quizQuestionId: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/quizzes-questions/delete/${quizQuestionId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
