export interface IFaqQuestionDTO {
  id: string;
  question: string;
  answer: string;
  company_id?: string;
}

export interface ICreateFaqQuestionDTO {
  question: string;
  answer: string;
  company_id: string;
}

export interface IUpdateFaqQuestionDTO {
  id: string;
  question?: string;
  answer?: string;
}
