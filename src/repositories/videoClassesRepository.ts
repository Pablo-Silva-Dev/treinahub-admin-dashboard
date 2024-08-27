import { ICreateVideoClassDTO, IVideoClassDTO } from "@/interfaces/dtos/Class";
import { api, IApiSuccessResponse } from "@/services/api";
import { IVideoClassesRepository } from "./interfaces/videoClassesRepository";

export class VideoClassesRepository implements IVideoClassesRepository {
  async create(data: ICreateVideoClassDTO): Promise<IVideoClassDTO> {
    try {
      const { name, training_id, description, img_file, video_file } = data;

      const formData = new FormData();

      formData.append("name", name);
      formData.append("training_id", training_id);
      formData.append("description", description);
      formData.append("img_file", img_file);
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
  async list(): Promise<IVideoClassDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IVideoClassDTO[]>>(
        "/video-classes/list"
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async delete(videoClassId: string): Promise<void> {
    try {
      const response = await api.delete(`video-classes/delete/${videoClassId}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
