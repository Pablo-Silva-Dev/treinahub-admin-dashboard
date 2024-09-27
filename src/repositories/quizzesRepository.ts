import { api, IApiSuccessResponse } from "@/services/api";
import { ICreateQuizDTO, IQuizDTO } from "./dtos/QuizDTO";
import { IQuizzesRepository } from "./interfaces/quizzesRepository";
export class QuizzesRepository implements IQuizzesRepository {
  async createQuiz(data: ICreateQuizDTO): Promise<IQuizDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IQuizDTO>>(
        "/quizzes/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listQuizzes(): Promise<IQuizDTO[]> {
    try {
      const response =
        await api.get<IApiSuccessResponse<IQuizDTO[]>>("/quizzes/list");
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getQuizById(quizId: string): Promise<IQuizDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IQuizDTO>>(
        `/quizzes/get-by-id/${quizId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteQuiz(quiz_id: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/quizzes/${quiz_id}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
