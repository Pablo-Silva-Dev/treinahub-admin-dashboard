import { REQUIRED_FIELD_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { TextInput } from "@/components/inputs/TextInput";
import { Text } from "@/components/typography/Text";
import { cpfMask } from "@/utils/masks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export interface RecoveryPasswordByEmailInputs {
  email: string;
  cpf: string;
}

interface RecoveryPasswordByEmailFormProps {
  onSubmit: (data: RecoveryPasswordByEmailInputs) => void;
  isLoading: boolean;
  onReceiveCodeBySMS: () => void;
}

export default function RecoveryPasswordByEmailForm({
  onSubmit,
  isLoading,
  onReceiveCodeBySMS,
}: RecoveryPasswordByEmailFormProps) {
  const validationSchema = yup.object({
    email: yup.string().required(REQUIRED_FIELD_MESSAGE),
    cpf: yup.string().required(REQUIRED_FIELD_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleSubmitForm = (data: RecoveryPasswordByEmailInputs) => {
    onSubmit(data);
  };

  const emailValue = watch("email");
  const cpfValue = watch("cpf");

  return (
    <div className="max-w-lg bg-gray-50 dark:bg-slate-800   p-6 shadow-xl rounded-lg mx-auto w-[90%] lg:w-[400px]  mb-[40px] lg:mb-0">
      <form className="w-full" onSubmit={handleSubmit(handleSubmitForm)}>
        <div className="w-full flex flex-row mb-4">
          <Text content="Informe seu email e CPF para receber seu código de redefinição de senha no email informado." />
        </div>

        <div className="w-full flex flex-col mb-4">
          <TextInput
            inputLabel="Email"
            placeholder="Seu email"
            {...register("email")}
          />
          {errors.email && <ErrorMessage errorMessage={errors.email.message} />}
        </div>
        <div className="w-full flex flex-col mb-4">
          <MaskedTextInput
            mask={cpfMask}
            inputLabel="CPF"
            placeholder="Seu CPF"
            inputMode="numeric"
            {...register("cpf")}
          />
          {errors.cpf && <ErrorMessage errorMessage={errors.cpf.message} />}
        </div>
        <div className="w-full mt-2">
          <Button
            type="submit"
            title="Receber Código"
            disabled={!cpfValue || !emailValue || isLoading}
            isLoading={isLoading}
          />
        </div>
      </form>
      <div className="w-full mt-4">
        <LinkButton
          title="Receber código via SMS"
          onClick={onReceiveCodeBySMS}
        />
      </div>
    </div>
  );
}
