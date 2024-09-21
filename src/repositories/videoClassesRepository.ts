import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICreateVideoClassDTO,
  IUpdateVideoClassDTO,
  IVideoClassDTO,
} from "./dtos/VideoClassDTO";
import { IVideoClassesRepository } from "./interfaces/videoClassesRepository";

export class VideoClassesRepository implements IVideoClassesRepository {
  async createVideoClass(data: ICreateVideoClassDTO): Promise<IVideoClassDTO> {
    try {
      const { name, training_id, description, video_file } = data;

      const formData = new FormData();

      formData.append("name", name);
      formData.append("training_id", training_id);
      formData.append("description", description);
      formData.append("video_file", video_file);

      const response = await api.post<IApiSuccessResponse<IVideoClassDTO>>(
        "/video-classes/create",
        formData
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listVideoClasses(): Promise<IVideoClassDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IVideoClassDTO[]>>(
        "/video-classes/list"
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getVideoClassById(videoClassId: string): Promise<IVideoClassDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<IVideoClassDTO>>(
        `/video-classes/get-by-id/${videoClassId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listVideoClassesByTrainingId(
    trainingId: string
  ): Promise<IVideoClassDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IVideoClassDTO[]>>(
        `/video-classes/list-by-training/${trainingId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteVideoClass(videoClassId: string): Promise<void> {
    try {
      const response = await api.delete(`video-classes/delete/${videoClassId}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }

  async updateVideoClass(data: IUpdateVideoClassDTO): Promise<IVideoClassDTO> {
    try {
      const response = await api.put("video-classes/update", data);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
