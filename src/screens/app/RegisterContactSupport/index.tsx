import {
  EMAIL_INVALID_MESSAGE,
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { TextInput } from "@/components/inputs/TextInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { ContactsSupportRepository } from "@/repositories/contactsSupportRepository";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { formatPhoneNumber } from "@/utils/formats";
import { phoneMask } from "@/utils/masks";
import { maskedPhoneValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface RegisterContactSupportInputs {
  name: string;
  contact_number: string;
  email: string;
}

export function RegisterContactSupport() {
  const validationSchema = yup.object({
    name: yup.string().required(REQUIRED_FIELD_MESSAGE),
    email: yup
      .string()
      .email(EMAIL_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    contact_number: yup
      .string()
      .matches(maskedPhoneValidationRegex, PHONE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
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

  const { isLoading, setIsLoading } = useLoading();

  const contactsSupportRepository = useMemo(() => {
    return new ContactsSupportRepository();
  }, []);

  const handleRegisterContactSupport: SubmitHandler<
    RegisterContactSupportInputs
  > = async (data) => {
    try {
      setIsLoading(true);
      await contactsSupportRepository.createContactSupport({
        ...data,
        contact_number: formatPhoneNumber(data.contact_number),
      });
      showAlertSuccess("Contato cadastrado com sucesso!");
      reset();
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        if (error.STATUS === 409) {
          showAlertError("Já existe um contato para o número cadastrado.");
        }
      } else {
        showAlertError("Houve um erro ao cadastrar contato.");
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col bg-gray-100 dark:bg-slate-800 w-full">
      <div className="flex flex-col items-center w-[90%] lg:w-[560px] mx-auto">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar contato de suporte"
            iconName="help-circle"
          />
        </div>
        <form
          className="w-full"
          onSubmit={handleSubmit(handleRegisterContactSupport)}
        >
          <div className="w-full mb-4">
            <TextInput
              inputLabel="Nome"
              placeholder="Nome do contato"
              {...register("name")}
            />
            {errors && errors.name && (
              <ErrorMessage errorMessage={errors.name?.message} />
            )}
          </div>
          <div className="w-full mb-4">
            <MaskedTextInput
              inputLabel="Telefone"
              placeholder="Telefone de contato"
              mask={phoneMask}
              inputMode="numeric"
              {...register("contact_number")}
            />

            {errors && errors.contact_number && (
              <ErrorMessage errorMessage={errors.contact_number?.message} />
            )}
          </div>
          <div className="w-full mb-4">
            <TextInput
              inputLabel="Email"
              placeholder="Email do contato"
              {...register("email")}
            />
            {errors && errors.email && (
              <ErrorMessage errorMessage={errors.email?.message} />
            )}
          </div>
          <div className="w-full mt-2">
            <Button
              title="Cadastrar contato"
              type="submit"
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
