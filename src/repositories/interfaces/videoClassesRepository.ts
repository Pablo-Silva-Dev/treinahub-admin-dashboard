import { ICreateVideoClassDTO, IVideoClassDTO } from "@/interfaces/dtos/Class";

export interface IVideoClassesRepository {
  create(data: ICreateVideoClassDTO): Promise<IVideoClassDTO>;
  list(): Promise<IVideoClassDTO[]>;
  delete(videoClassId: string): Promise<void>;
}
