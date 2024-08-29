import {
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { Text } from "@/components/typography/Text";
import { formatPhoneNumber } from "@/utils/formats";
import { phoneMask } from "@/utils/masks";
import { phoneValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface RecoveryPasswordBySMSInputs {
  phone: string;
}

interface RecoveryPasswordBySMSFormProps {
  onSubmit: (data: RecoveryPasswordBySMSInputs) => void;
  onReceiveCodeByEmail: () => void;
  isLoading: boolean;
}

export default function RecoveryPasswordBySMSForm({
  onSubmit,
  onReceiveCodeByEmail,
  isLoading,
}: RecoveryPasswordBySMSFormProps) {
  const validationSchema = yup.object({
    phone: yup
      .string()
      .transform((value) => {
        try {
          return formatPhoneNumber(value);
        } catch (error) {
          console.log("Error at trying to format phone number.", error);
          return value;
        }
      })
      .matches(phoneValidationRegex, PHONE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const handleSubmitForm = (data: RecoveryPasswordBySMSInputs) => {
    onSubmit(data);
  };

  return (
    <div className="max-w-lg bg-gray-50 dark:bg-slate-800   p-6 shadow-xl rounded-lg mx-auto w-[90%] lg:w-[400px]  mb-[40px] lg:mb-0">
      <form className="w-full" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="w-full flex flex-row mb-4">
          <Text content="Informe seu número de telefone para receber o código de recuperação via SMS." />
        </div>

        <div className="w-full flex flex-col mb-4">
          <MaskedTextInput
            mask={phoneMask}
            inputLabel="Telefone"
            placeholder="Seu número de telefone"
            inputMode="numeric"
            {...register("phone")}
          />
          {errors.phone && <ErrorMessage errorMessage={errors.phone.message} />}
        </div>
        <div className="w-full mt-2">
          <Button
            type="submit"
            title="Receber Código"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          />
        </div>
      </form>
      <div className="w-full mt-4">
        <LinkButton
          title="Receber código via e-mail"
          onClick={onReceiveCodeByEmail}
        />
      </div>
    </div>
  );
}
