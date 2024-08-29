
import { ICreateVideoClassDTO, IUpdateVideoClassDTO, IVideoClassDTO } from "../dtos/VideoClassDTO";

export interface IVideoClassesRepository {
  createVideoClass(data: ICreateVideoClassDTO): Promise<IVideoClassDTO>;
  listVideoClasses(): Promise<IVideoClassDTO[]>;
  deleteVideoClass(videoClassId: string): Promise<void>;
  getVideoClassById(videoClassId: string): Promise<IVideoClassDTO>;
  updateVideoClass(data: IUpdateVideoClassDTO): Promise<IVideoClassDTO>;
}
