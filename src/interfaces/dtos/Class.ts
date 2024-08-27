export interface IVideoClassDTO {
  name: string;
  description: string;
  tutor_name: string;
  module_name: string;
  course_name: string;
  video_url: string;
  duration: string;
}

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
