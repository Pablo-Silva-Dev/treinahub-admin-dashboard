import {
  IGetRecoveryPasswordCodeByEmailDTO,
  IGetRecoveryPasswordCodeBySMSDTO,
  IUpdateUserDTO,
  IUserDTO,
} from "../dtos/UserDTO";

export interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

export interface IAuthenticateUserResponse {
  name: string;
  email: string;
  token: string;
  companyId: string
}

export interface IRegisterUserRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password: string;
  is_admin?: boolean;
  company_id: string;
}

export interface IUsersRepository {
  authenticateUser(
    data: IAuthenticateUserRequest
  ): Promise<IAuthenticateUserResponse>;
  registerUser(data: IRegisterUserRequest): Promise<IUserDTO>;
  listUsers(): Promise<IUserDTO[] | []>;
  getUserByEmail(email: string): Promise<IUserDTO | void>;
  getUserByCpf(cpf: string): Promise<IUserDTO | void>;
  getUserById(id: string): Promise<IUserDTO | void>;
  getUserByPhone(phone: string): Promise<IUserDTO | void>;
  updateUser(data: IUpdateUserDTO): Promise<IUserDTO | void>;
  deleteUser(id: string): Promise<void>;
  getRecoveryPasswordCodeByEmail(
    data: IGetRecoveryPasswordCodeByEmailDTO
  ): Promise<string>;
  getRecoveryPasswordCodeBySMS(
    data: IGetRecoveryPasswordCodeBySMSDTO
  ): Promise<string>;
}
