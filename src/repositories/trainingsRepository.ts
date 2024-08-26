import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateTrainingDTO,
  ITrainingDTO,
  ITrainingsRepository,
  IUpdateTrainingDTO,
} from "./interfaces/trainingsRepository";

export class TrainingsRepositories implements ITrainingsRepository {
  async createTraining(data: ICreateTrainingDTO): Promise<ITrainingDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<ITrainingDTO>>(
        "/trainings/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listTrainings(): Promise<ITrainingDTO[]> {
    try {
      const response =
        await api.get<IApiSuccessResponse<ITrainingDTO[]>>("/trainings/list");
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getTrainingById(id: string): Promise<ITrainingDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<ITrainingDTO>>(
        `/trainings/get-by-id/${id}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateTraining(data: IUpdateTrainingDTO): Promise<ITrainingDTO> {
    try {
      const response = await api.put<IApiSuccessResponse<ITrainingDTO>>(
        "/trainings/update",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteTraining(id: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/trainings/delete/${id}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
