import {
  ICompanyDTO,
  IUpdateCompanyDTO,
  IUpdateCompanyLogoDTO,
} from "../dtos/CompanyDTO";

export interface ICompaniesRepository {
  getCompany(companyId: string): Promise<ICompanyDTO>;
  listCompanies(): Promise<ICompanyDTO[]>;
  updateCompanyLogo(data: IUpdateCompanyLogoDTO): Promise<ICompanyDTO>;
  updateCompany(data: IUpdateCompanyDTO): Promise<ICompanyDTO>;
  deleteCompany(companyId: string): Promise<void>;
}
