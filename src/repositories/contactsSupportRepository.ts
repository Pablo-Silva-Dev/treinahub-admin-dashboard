import { api, IApiSuccessResponse } from "@/services/api";
import {
  IContactSupportDTO,
  ICreateContactSupportDTO,
  IUpdateContactSupportDTO,
} from "./dtos/ContactSupportDTO";
import { IContactsSupport } from "./interfaces/contactsSupportRepository";

export class ContactsSupportRepository implements IContactsSupport {
  async listContacts(companyId: string): Promise<IContactSupportDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IContactSupportDTO[]>>(
        `/contacts-support/list/${companyId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async createContactSupport(
    data: ICreateContactSupportDTO
  ): Promise<IContactSupportDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<IContactSupportDTO>>(
        "/contacts-support/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateContactSupport(
    data: IUpdateContactSupportDTO
  ): Promise<IContactSupportDTO> {
    try {
      const response = await api.put<IApiSuccessResponse<IContactSupportDTO>>(
        "/contacts-support/update",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteContactSupport(contactSupportId: string): Promise<void> {
    try {
      const response = await api.delete<IApiSuccessResponse<void>>(
        `/contacts-support/delete/${contactSupportId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
