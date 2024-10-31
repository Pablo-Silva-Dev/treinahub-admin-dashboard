import { ICompanyDTO } from "../dtos/CompanyDTO";

export interface ICompaniesRepository {
  getCompany(companyId: string): Promise<ICompanyDTO>;
  listCompanies(): Promise<ICompanyDTO[]>;
}
