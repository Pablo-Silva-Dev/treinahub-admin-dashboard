import { ICompanyDTO } from "./CompanyDTO";

export interface IUserDTO {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: string;
  password: string;
  cep?: string;
  street?: string;
  district?: string;
  city?: string;
  uf?: string;
  residence_number?: string;
  is_admin: boolean;
  company?: ICompanyDTO;
  company_id: string;
}

export interface ICreateUserDTO {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password: string;
  is_admin?: boolean;
  company_id: string;
}

export interface IUpdateUserDTO {
  id: string;
  phone?: string;
  password?: string;
  cep?: string;
  street?: string;
  district?: string;
  city?: string;
  uf?: string;
  residence_number?: string;
}

export interface IUpdateUserDTO {
  id: string;
  phone?: string;
  password?: string;
  cep?: string;
  street?: string;
  district?: string;
  city?: string;
  uf?: string;
  residence_number?: string;
}

export interface IGetRecoveryPasswordCodeByEmailDTO {
  cpf: string;
  email: string;
}

export interface IGetRecoveryPasswordCodeBySMSDTO {
  phone: string;
}

export interface IRecoveryCodeDTO {
  code: string;
}
