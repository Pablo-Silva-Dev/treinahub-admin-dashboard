import { api, IApiSuccessResponse } from "@/services/api";
import {
  IAuthenticateUserRequest,
  IAuthenticateUserResponse,
  IGetRecoveryPasswordCodeByEmailDTO,
  IRegisterUserRequest,
  IUpdateUserDTO,
  IUserDTO,
  IUsersRepository,
} from "./interfaces/usersRepositoriesInterface";

export class UsersRepositories implements IUsersRepository {
  async registerUser(data: IRegisterUserRequest): Promise<IUserDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IUserDTO>>(
        "/users/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listUsers(): Promise<IUserDTO[] | []> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO[] | []>>(
        "/users/list"
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getUserByEmail(email: string): Promise<IUserDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO | void>>(
        `/users/get-by-email/${email}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getUserByCpf(cpf: string): Promise<IUserDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO | void>>(
        `/users/get-by-cpf/${cpf}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id: string): Promise<IUserDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO | void>>(
        `/users/get-by-id/${id}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getUserByPhone(phone: string): Promise<IUserDTO | void> {
    try {
      const response = await api.get<IApiSuccessResponse<IUserDTO | void>>(
        `/users/get-by-phone/${phone}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateUser(data: IUpdateUserDTO): Promise<IUserDTO | void> {
    try {
      const response = await api.put<IApiSuccessResponse<IUserDTO | void>>(
        "/users/update",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(id: string): Promise<void> {
    try {
      const response = await api.delete(`/users/delete/${id}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getRecoveryPasswordCodeByEmail(
    data: IGetRecoveryPasswordCodeByEmailDTO
  ): Promise<string> {
    try {
      const response = await api.post<IApiSuccessResponse<string>>(
        "/users/get-recovery-password-code-by-email",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getRecoveryPasswordCodeBySMS(phone: string): Promise<string> {
    try {
      const response = await api.post<IApiSuccessResponse<string>>(
        "/users/get-recovery-password-code-by-phone",
        phone
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async authenticateUser(
    data: IAuthenticateUserRequest
  ): Promise<IAuthenticateUserResponse> {
    try {
      const response = await api.post<
        IApiSuccessResponse<IAuthenticateUserResponse>
      >("/users/auth", data);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
