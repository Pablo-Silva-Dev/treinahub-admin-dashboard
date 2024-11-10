import { ITrainingDTO } from "./TrainingDTO";
import { IUserDTO } from "./UserDTO";

export type TPlan = "gold" | "platinum" | "diamond";

export interface ICompanyDTO {
  id: string;
  fantasy_name: string;
  cnpj: string;
  social_reason: string;
  email: string;
  phone: string;
  cep: string;
  city: string;
  district: string;
  number_of_employees: string;
  company_sector: string;
  residence_complement: string;
  residence_number: string;
  street: string;
  uf: string;
  current_plan: TPlan;
  logo_url: string;
  users?: IUserDTO[];
  trainings?: ITrainingDTO[];
}

export interface IUpdatableCompanyDTO {
  id: string;
  fantasy_name?: string;
  email?: string;
  phone?: string;
}

export interface IUpdateCompanyDTO {
  id: string;
  fantasy_name?: string;
  email?: string;
  phone?: string;
}

export interface IUpdateCompanyPlanDTO {
  id: string;
  current_plan: TPlan;
}

export interface IUpdateCompanyLogoDTO {
  id: string;
  img_file: Blob;
}
