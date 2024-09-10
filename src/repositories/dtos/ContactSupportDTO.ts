export interface IContactSupportDTO {
  id: string;
  contact_number: string;
  name: string;
  email: string;
  hide_contact_number: boolean;
}

export interface ICreateContactSupportDTO {
  contact_number: string;
  name: string;
  email: string;
}

export interface IUpdateContactSupportDTO {
  id: string;
  contact_number?: string;
  name?: string;
  email?: string;
  hide_contact_number?: boolean;
}
