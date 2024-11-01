import {
  EMAIL_INVALID_MESSAGE,
  PHONE_INVALID_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { TextInput } from "@/components/inputs/TextInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { IUpdatableCompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { useAuthenticationStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { phoneWithoutCountryCodeValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

interface EditCompanyModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onClose: () => void;
  onConfirmAction: (company: IUpdatableCompanyDTO) => void;
  isLoading: boolean;
}

export interface UpdateCompanyInputs {
  id: string;
  fantasy_name: string;
  email: string;
  phone: string;
}

export function EditCompanyModal({
  isOpen,
  onRequestClose,
  onClose,
  onConfirmAction,
  isLoading,
}: EditCompanyModalProps) {
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();

  const [company, setCompany] = useState<IUpdatableCompanyDTO | null>(null);

  const validationSchema = yup.object({
    id: yup.string(),
    fantasy_name: yup.string().optional(),
    phone: yup
      .string()
      .matches(phoneWithoutCountryCodeValidationRegex, PHONE_INVALID_MESSAGE)
      .optional(),
    email: yup.string().email(EMAIL_INVALID_MESSAGE).optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const companyRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompanyDetails = useCallback(async () => {
    try {
      const company = await companyRepository.getCompany(user.companyId);
      setCompany(company);
      reset({
        id: company.id,
        fantasy_name: company.fantasy_name,
        email: company.email,
        phone: company.phone,
      });
    } catch (error) {
      console.log(error);
    }
  }, [companyRepository, reset, user.companyId]);

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]);

  const handleUpdateCompany: SubmitHandler<UpdateCompanyInputs> = (data) => {
    onConfirmAction(data);
    reset(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualização dos dados da empresa"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar o nome, email e telefone da empresa"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />
      <form onSubmit={handleSubmit(handleUpdateCompany as never)}>
        <div className="my-4">
          <TextInput
            inputLabel="Nome"
            defaultValue={company?.fantasy_name}
            placeholder="Novo nome da empresa"
            {...register("fantasy_name")}
          />
          {errors && errors.fantasy_name && (
            <ErrorMessage errorMessage={errors.fantasy_name?.message} />
          )}
        </div>
        <div className="my-4">
          <TextInput
            inputLabel="Email"
            defaultValue={company?.email}
            placeholder="Novo email de contato"
            {...register("email")}
          />
          {errors && errors.email && (
            <ErrorMessage errorMessage={errors.email?.message} />
          )}
        </div>
        <div className="my-4">
          <TextInput
            inputLabel="Telefone"
            defaultValue={company?.phone}
            placeholder="Novo telefone de contato"
            {...register("phone")}
          />
          {errors && errors.phone && (
            <ErrorMessage errorMessage={errors.phone?.message} />
          )}
        </div>
        <div className="w-full mt-6">
          <Button
            title="Salvar dados"
            type="submit"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          />
        </div>
      </form>
      <button
        onClick={handleClose}
        className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
      >
        Cancelar
      </button>
    </Modal>
  );
}
