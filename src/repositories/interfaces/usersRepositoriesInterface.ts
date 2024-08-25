export interface IAuthenticateUserRequest {
  email: string;
  password: string;
}

export interface IAuthenticateUserResponse {
  name: string;
  email: string;
  token: string;
}

export interface IRegisterUserRequest {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birth_date: Date;
  password: string;
  is_admin?: boolean;
}

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
