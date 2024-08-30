import {
  IContactSupportDTO,
  ICreateContactSupportDTO,
  IUpdateContactSupportDTO,
} from "../dtos/ContactSupportDTO";

export interface IContactsSupport {
  listContacts(): Promise<IContactSupportDTO[]>;
  createContactSupport(
    data: ICreateContactSupportDTO
  ): Promise<IContactSupportDTO>;
  updateContactSupport(
    data: IUpdateContactSupportDTO
  ): Promise<IContactSupportDTO>;
  deleteContactSupport(contactSupportId: string): Promise<void>;
}
