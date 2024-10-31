import { api, IApiSuccessResponse } from "@/services/api";
import { ICompanyDTO } from "./dtos/CompanyDTO";
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
}
