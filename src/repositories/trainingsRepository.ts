import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateTrainingDTO,
  ITrainingDTO,
  ITrainingsRepository,
  IUpdateTrainingDTO,
} from "./interfaces/trainingsRepository";

export class TrainingsRepositories implements ITrainingsRepository {
  async createTraining(data: ICreateTrainingDTO): Promise<ITrainingDTO> {
    const { name, description, file } = data;

    const formData = new FormData();

    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file, file.name);

    try {
      const response = await api.post<IApiSuccessResponse<ITrainingDTO>>(
        "/trainings/create",
        formData
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
    const { id, name, description, file } = data;

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);

    if (file) {
      formData.append("file", file, file.name);
    }

    try {
      const response = await api.put<IApiSuccessResponse<ITrainingDTO>>(
        "/trainings/update",
        formData
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
