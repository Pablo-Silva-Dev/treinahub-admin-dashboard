import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICompanyDTO,
  IUpdateCompanyDTO,
  IUpdateCompanyLogoDTO,
} from "./dtos/CompanyDTO";
import { ICompaniesRepository } from "./interfaces/companiesRepository";

export class CompaniesRepository implements ICompaniesRepository {
  async getCompany(companyId: string): Promise<ICompanyDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<ICompanyDTO>>(
        `/companies/get-by-id/${companyId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listCompanies(): Promise<ICompanyDTO[]> {
    try {
      const response =
        await api.get<IApiSuccessResponse<ICompanyDTO[]>>("/companies/list");
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async deleteCompany(companyId: string): Promise<void> {
    try {
      await api.delete(`/companies/delete/${companyId}`);
    } catch (error) {
      throw error;
    }
  }
  async updateCompanyLogo(data: IUpdateCompanyLogoDTO): Promise<ICompanyDTO> {
    try {
      const { id, img_file } = data;

      const formData = new FormData();

      formData.append("id", id);

      if (img_file) {
        formData.append("img_file", img_file);
      }

      const response = await api.patch<IApiSuccessResponse<ICompanyDTO>>(
        "/companies/update-company-logo",
        formData
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async updateCompany(data: IUpdateCompanyDTO): Promise<ICompanyDTO> {
    try {
      const response = await api.put<IApiSuccessResponse<ICompanyDTO>>(
        "/companies/update-company",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
