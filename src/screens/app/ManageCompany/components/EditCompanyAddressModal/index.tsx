import { BRAZILIAN_STATE_OPTIONS } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { SelectInput } from "@/components/inputs/SelectInput";
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
import { cepMask } from "@/utils/masks";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
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

interface EditCompanyAddressModalProps {
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

export function EditCompanyAddressModal({
  isOpen,
  onRequestClose,
  onClose,
  onConfirmAction,
  isLoading,
}: EditCompanyAddressModalProps) {
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();

  const [company, setCompany] = useState<IUpdatableCompanyDTO | null>(null);
  const [citiesOptions, setCitiesOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const validationSchema = yup.object({
    id: yup.string(),
    cep: yup.string().optional(),
    city: yup.string().optional(),
    district: yup.string().optional(),
    residence_complement: yup.string().optional(),
    residence_number: yup.string().optional(),
    street: yup.string().optional(),
    uf: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const selectedUF = watch("uf") ?? "AP";

  const companyRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompanyDetails = useCallback(async () => {
    try {
      const company = await companyRepository.getCompany(user.companyId);
      setCompany(company);
      reset({
        id: company.id,
        cep: company.cep,
        city: company.city,
        district: company.district,
        residence_complement: company.residence_complement,
        residence_number: company.residence_number,
        street: company.street,
        uf: company.uf,
      });
    } catch (error) {
      console.log(error);
    }
  }, [companyRepository, reset, user.companyId]);

  useEffect(() => {
    getCompanyDetails();
  }, [getCompanyDetails]);

  const handleUpdateCompanyAddress: SubmitHandler<UpdateCompanyInputs> = (
    data
  ) => {
    onConfirmAction(data);
    reset(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getCitiesByState = useCallback(async (uf: string) => {
    if (uf) {
      axios
        .get(`https://brasilapi.com.br/api/ibge/municipios/v1/${uf}`)
        .then((response) => {
          const cities = response.data.map((city: any) => ({
            label: city.nome,
            value: city.nome,
          }));

          setCitiesOptions(cities);
        })
        .catch((error) => {
          console.error(
            "There was an error at trying to call BrailAPI: ",
            error
          );
        });
    }
  }, []);

  useEffect(() => {
    getCitiesByState(selectedUF);
  }, [getCitiesByState, selectedUF]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualização do endereço da empresa"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar informações de endereço da empresa"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />
      <form onSubmit={handleSubmit(handleUpdateCompanyAddress as never)}>
        <div className="my-4 flex flex-col md:flex-row items-center">
          <MaskedTextInput
            mask={cepMask}
            inputLabel="CEP"
            placeholder="CEP"
            defaultValue={company?.cep}
            {...register("cep")}
          />
          {errors && errors.cep && (
            <ErrorMessage errorMessage={errors.cep?.message} />
          )}
          <div className="w-full md:ml-3">
            <TextInput
              inputLabel="Rua"
              placeholder="Rua"
              defaultValue={company?.street}
              {...register("street")}
            />
            {errors && errors.street && (
              <ErrorMessage errorMessage={errors.street?.message} />
            )}
          </div>
        </div>
        <div className="my-4 flex flex-col md:flex-row items-center">
          <TextInput
            inputLabel="Bairro"
            placeholder="Bairro"
            defaultValue={company?.district}
            {...register("district")}
          />
          {errors && errors.district && (
            <ErrorMessage errorMessage={errors.district?.message} />
          )}
          <div className="w-full md:ml-3">
            <TextInput
              inputLabel="Número"
              placeholder="Número"
              defaultValue={company?.residence_number}
              {...register("residence_number")}
            />
            {errors && errors.residence_number && (
              <ErrorMessage errorMessage={errors.residence_number?.message} />
            )}
          </div>
        </div>
        <div className="my-4 flex flex-col md:flex-row items-center">
          <TextInput
            inputLabel="Complemento"
            placeholder="Complemento"
            defaultValue={company?.residence_complement}
            {...register("residence_complement")}
          />
          {errors && errors.residence_complement && (
            <ErrorMessage errorMessage={errors.residence_complement?.message} />
          )}
          <div className="w-full md:ml-3">
            <SelectInput
              label="UF"
              placeholder="UF"
              options={BRAZILIAN_STATE_OPTIONS}
              onSelectOption={(val) => {
                setValue("uf", val.value as never);
              }}
            />
            {errors && errors.uf && (
              <ErrorMessage errorMessage={errors.uf?.message} />
            )}
          </div>
        </div>
        <div className="my-4">
          <SelectInput
            label="Cidade"
            placeholder="Selecione uma cidade"
            options={citiesOptions}
            onSelectOption={(val) => {
              setValue("city", val.value as never);
            }}
          />
          {errors && errors.city && (
            <ErrorMessage errorMessage={errors.city?.message} />
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
