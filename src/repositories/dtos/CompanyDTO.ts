import { IUserDTO } from "./UserDTO";

export type TPlan = "gold" | "platinum" | "diamond";

export interface ICompanyDTO {
  id: string;
  fantasy_name: string;
  cnpj: string;
  social_reason: string;
  email: string;
  phone: string;
  current_plan: TPlan;
  logo_url: string;
  users?: IUserDTO[];
}
