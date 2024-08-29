import { ICertificateDTO } from "../dtos/CertificateDTO";

export interface ICertificatesRepository {
  listCertificates(): Promise<ICertificateDTO[]>;
  listCertificatesByUser(userId: string): Promise<ICertificateDTO[]>;
  listCertificatesByTraining(trainingId: string): Promise<ICertificateDTO[]>;
  getCertificateById(certificateId: string): Promise<ICertificateDTO>;
}
