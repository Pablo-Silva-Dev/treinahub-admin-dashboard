const REQUIRED_FIELD_MESSAGE = "Campo obrigatório";
const PASSWORD_MESSAGES_NOT_MATCH = "As senhas não correspondem";
const PASSWORD_MIN_LENGTH_MESSAGE = "Sua senha deve ter pelo menos 8 dígitos";
const EMAIL_INVALID_MESSAGE = "Email inválido";
const CPF_INVALID_MESSAGE = "CPF inválido";
const PHONE_INVALID_MESSAGE = "Telefone inválido";
const BIRTH_DATE_INVALID_MESSAGE = "Data inválida";
const NAME_MIN_MESSAGE = "O nome está muito curto";
const DESCRIPTION_MIN_MESSAGE = "A descrição está muito curta";
const ANSWER_MIN_MESSAGE = "A resposta está muito curta";
const MIN_PASSWORD_LENGTH = 8;
const FILE_MAX_SIZE_MESSAGE =
  "Arquivo muito grande. O arquivo deve ter no máximo ";
const FILE_TYPE_UNSUPPORTED_MESSAGE =
  "Formato inválido. Forneça um arquivo do tipo  ";
const NAVIGATION_TIMER = 1000;
const PRIMARY_COLOR = "#0267FF";
const MAX_CONTENT_LENGTH_MESSAGE =
  "Conteúdo está excendo a quantidade máxima de caracteres permitidos";
const MIN_ID_LENGTH = 32;
const WRONG_COMPANY_ID_MESSAGE =
  "O identificador da empresa deve ser um código hexadecimal de pelo menos 32 caracteres. Exemplo: 'cce69c68-0c47-491a-9954-1fa7e627aa72'";

const ITEMS_PER_PAGE_OPTIONS = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const ITEMS_PER_PAGE_OPTIONS_SHORT_TABLE = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
];

const STORAGE_LIMIT_BRONZE_PLAN = import.meta.env
  .VITE_STORAGE_LIMIT_BRONZE_PLAN;
const STORAGE_LIMIT_SILVER_PLAN = import.meta.env
  .VITE_STORAGE_LIMIT_SILVER_PLAN;
const STORAGE_LIMIT_GOLD_PLAN = import.meta.env.VITE_STORAGE_LIMIT_GOLD_PLAN;

const FREE_EMPLOYEES_LIMIT_BRONZE_PLAN = import.meta.env
  .VITE_FREE_EMPLOYEES_LIMIT_BRONZE_PLAN;
const FREE_EMPLOYEES_LIMIT_SILVER_PLAN = import.meta.env
  .VITE_FREE_EMPLOYEES_LIMIT_SILVER_PLAN;
const FREE_EMPLOYEES_LIMIT_GOLD_PLAN = import.meta.env
  .VITE_FREE_EMPLOYEES_LIMIT_GOLD_PLAN;

const BRAZILIAN_STATE_OPTIONS = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];


export {
  ANSWER_MIN_MESSAGE,
  BIRTH_DATE_INVALID_MESSAGE,
  CPF_INVALID_MESSAGE,
  DESCRIPTION_MIN_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
  FILE_TYPE_UNSUPPORTED_MESSAGE,
  FREE_EMPLOYEES_LIMIT_BRONZE_PLAN,
  FREE_EMPLOYEES_LIMIT_GOLD_PLAN,
  FREE_EMPLOYEES_LIMIT_SILVER_PLAN,
  ITEMS_PER_PAGE_OPTIONS,
  ITEMS_PER_PAGE_OPTIONS_SHORT_TABLE,
  MAX_CONTENT_LENGTH_MESSAGE,
  MIN_ID_LENGTH,
  MIN_PASSWORD_LENGTH,
  NAME_MIN_MESSAGE,
  NAVIGATION_TIMER,
  PASSWORD_MESSAGES_NOT_MATCH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PHONE_INVALID_MESSAGE,
  PRIMARY_COLOR,
  REQUIRED_FIELD_MESSAGE,
  STORAGE_LIMIT_BRONZE_PLAN,
  STORAGE_LIMIT_GOLD_PLAN,
  STORAGE_LIMIT_SILVER_PLAN,
  WRONG_COMPANY_ID_MESSAGE,
  BRAZILIAN_STATE_OPTIONS
};
