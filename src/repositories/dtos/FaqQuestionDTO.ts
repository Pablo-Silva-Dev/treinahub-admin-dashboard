export interface IFaqQuestionDTO {
  id: string;
  question: string;
  answer: string;
}

export interface ICreateFaqQuestionDTO {
  question: string;
  answer: string;
}

export interface IUpdateFaqQuestionDTO {
  id: string;
  question?: string;
  answer?: string;
}
