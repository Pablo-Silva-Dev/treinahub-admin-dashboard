import {
  EMAIL_INVALID_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { TextInput } from "@/components/inputs/TextInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
export interface SignInFormInputs {
  email: string;
  password: string;
}

interface SignInFormProps {
  onSubmit: (data: SignInFormInputs) => void;
  isLoading: boolean;
}

export function SignInForm({ onSubmit, isLoading }: SignInFormProps) {
  const validationSchema = yup.object({
    email: yup
      .string()
      .email(EMAIL_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    password: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const handleSubmitForm: SubmitHandler<SignInFormInputs> = (data) => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-col max-w-lg bg-gray-50 dark:bg-slate-800  p-6 shadow-xl rounded-lg mx-auto w-[90%] lg:w-[400px]">
      <form
        className="w-full flex flex-col"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <TextInput
          inputLabel="Email"
          placeholder="Seu email"
          {...register("email")}
        />
        {errors.email && <ErrorMessage errorMessage={errors.email.message} />}
        <PasswordTextInput
          inputLabel="Senha"
          placeholder="Sua senha de pelo menos 8 dígitos"
          {...register("password")}
        />
        {errors.password && (
          <ErrorMessage errorMessage={errors.password.message} />
        )}
        <div className="mt-2">
          <Button
            title="Acessar a plataforma"
            type="submit"
            disabled={!isValid}
            isLoading={isLoading}
          />
        </div>
      </form>
      <div className="flex w-full mt-4">
        <Link to="/recuperar-senha">
          <LinkButton title="Esqueci minha senha" />
        </Link>
      </div>
      <div className="flex flex-row w-full mt-4 items-center">
        <span className="text-gray-700 dark:text-gray-100 text-sm">
          Não tem uma conta?
        </span>
        <Link to="/cadastro" className="ml-2">
          <LinkButton title="Criar minha conta" />
        </Link>
      </div>
    </div>
  );
}
