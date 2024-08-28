export interface ICreateVideoClassDTO {
  name: string;
  description: string;
  training_id: string;
  img_file: Blob;
  video_file: Blob;
}

export interface IUpdateVideoClassDTO {
  id: string;
  name: string;
  description: string;
  file: Blob;
}
