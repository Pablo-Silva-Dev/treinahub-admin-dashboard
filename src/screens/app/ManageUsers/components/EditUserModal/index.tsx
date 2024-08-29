import { MIN_PASSWORD_LENGTH } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { PasswordRequirements } from "@/components/miscellaneous/PasswordRequirements";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { unformatPhoneNumber } from "@/utils/formats";
import { phoneMask } from "@/utils/masks";
import {
  Dispatch,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Modal from "react-modal";

interface EditUserModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
  isLoading: boolean;
  passwordConfirmation: string;
  setPasswordConfirmation: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  selectedUserId: string | null;
}

export function EditUserModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  isLoading,
  passwordConfirmation,
  setPasswordConfirmation,
  password,
  setPassword,
  phone,
  setPhone,
  selectedUserId,
}: EditUserModalProps) {
  const { theme } = useThemeStore();

  const usersRepository = useMemo(() => {
    return new UsersRepositories();
  }, []);

  const [phonePlaceholder, setPhonePlaceholder] = useState("");

  const getCurrentUser = useCallback(async () => {
    try {
      if (selectedUserId) {
        const user = await usersRepository.getUserById(selectedUserId);
        if (user) {
          setPhonePlaceholder(user.phone);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedUserId, usersRepository]);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  const passwordValidated = useRef(false);

  const handleSubmitForm = (event: FormEvent) => {
    event.preventDefault();
    onConfirmAction({
      id: selectedUserId!,
      password,
      phone,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <form onSubmit={handleSubmitForm}>
        <Title
          content="Atualização dos dados do usuário"
          className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
        />
        <Subtitle
          content="Você pode alterar dados de telefone e/ou senha do usuário"
          className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
        />
        <div className="my-4">
          <MaskedTextInput
            inputLabel="Telefone"
            placeholder={
              phonePlaceholder
                ? unformatPhoneNumber(phonePlaceholder)
                : "Novo número de telefone"
            }
            mask={phoneMask}
            value={phone}
            onChange={(val) => setPhone(val.target.value)}
          />
        </div>
        <PasswordRequirements
          password={password}
          passwordValidated={passwordValidated}
        />
        <div className="my-4">
          <PasswordTextInput
            inputLabel="Senha"
            value={password}
            onChange={(val) => setPassword(val.target.value)}
          />
        </div>
        <div className="my-4">
          <PasswordTextInput
            inputLabel="Confirmação de senha"
            placeholder="Confirme a nova senha"
            value={passwordConfirmation}
            onChange={(val) => setPasswordConfirmation(val.target.value)}
          />
        </div>

        <Button
          title="Salvar dados"
          type="submit"
          isLoading={isLoading}
          disabled={
            password !== passwordConfirmation ||
            (password.length >= MIN_PASSWORD_LENGTH &&
              !passwordValidated.current) ||
            isLoading
          }
        />
        <button
          onClick={onClose}
          className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
        >
          Cancelar
        </button>
      </form>
    </Modal>
  );
}
