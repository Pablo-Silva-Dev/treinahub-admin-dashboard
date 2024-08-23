import { MIN_PASSWORD_LENGTH } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { PasswordRequirements } from "@/components/miscellaneous/PasswordRequirements";
import { Text } from "@/components/typography/Text";
import { Dispatch, FormEvent, SetStateAction, useRef } from "react";

export interface UpdatePasswordInputs {
  id: string;
  password: string;
}

interface UpdatePasswordFormProps {
  onSubmit: (data: UpdatePasswordInputs) => void;
  isLoading: boolean;
  userId: string;
  password: string;
  passwordConfirmation: string;
  setPasswordConfirmation: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

export function UpdatePasswordForm({
  onSubmit,
  isLoading,
  userId,
  passwordConfirmation,
  setPasswordConfirmation,
  password,
  setPassword,
}: UpdatePasswordFormProps) {
  const passwordValidatedRef = useRef(false);

  const handleSubmitForm = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({ id: userId, password });
  };

  return (
    <form
      className="max-w-lg bg-gray-50 dark:bg-slate-800  p-6 shadow-xl rounded-lg mx-auto w-[90%] lg:w-[400px] mb-[40px] lg:mb-0"
      onSubmit={handleSubmitForm}
    >
      <div className="w-full flex flex-row mb-4">
        <Text content="Informe uma nova senha de acesso à plataforma." />
      </div>
      <div className="w-full flex mb-4">
        <PasswordRequirements
          password={password}
          passwordValidated={passwordValidatedRef}
        />
      </div>
      <div className="w-full flex flex-col mb-4">
        <PasswordTextInput
          inputLabel="Nova senha"
          placeholder="Sua nova senha"
          value={password}
          onChange={(val) => setPassword(val.target.value)}
        />
      </div>
      <div className="w-full flex flex-col mb-4">
        <PasswordTextInput
          inputLabel="Confirmação da nova senha"
          placeholder="Confirme sua nova senha"
          value={passwordConfirmation}
          onChange={(val) => setPasswordConfirmation(val.target.value)}
        />
        {password.length >= MIN_PASSWORD_LENGTH &&
          passwordConfirmation.length >= MIN_PASSWORD_LENGTH &&
          password !== passwordConfirmation && (
            <ErrorMessage errorMessage="As senhas não correspondem" />
          )}
      </div>
      <div className="w-full mt-2">
        <Button
          type="submit"
          title="Redefinir Senha"
          disabled={
            password.length < MIN_PASSWORD_LENGTH ||
            passwordConfirmation.length < MIN_PASSWORD_LENGTH ||
            password !== passwordConfirmation ||
            !passwordValidatedRef.current ||
            isLoading
          }
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}
