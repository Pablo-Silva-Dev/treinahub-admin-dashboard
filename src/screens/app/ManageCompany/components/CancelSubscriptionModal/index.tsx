import { TextInput } from "@/components/inputs/TextInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import {
  ChangeEvent,
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
} from "react";
import Modal from "react-modal";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  isPasswordValid: boolean;
  isButtonDisabled: boolean;
}

export function CancelSubscriptionModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  password,
  setPassword,
  isPasswordValid,
  isButtonDisabled
}: CancelSubscriptionModalProps) {
  const { theme } = useThemeStore();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Confirmação de exclusão e cancelamento"
        className="text-center text-black dark:text-white mb-4 font-bold text-md md:text-lg"
      />
      <Subtitle
        content={`Deseja realmente remover esta empresa e cancelar sua inscrição?`}
        className="text-center text-orange-500 mb-2  text-md  md:text-md"
      />
      <Subtitle
        content="Todos os dados da empresa serão removidos. Todos os usuários da empresa perderão imediatamente o acesso à plataforma."
        className="text-center text-orange-400 mb-2 text-sm  md:text-md"
      />
      <Subtitle
        content="Essa ação não é reversível!"
        className="text-center text-orange-400 mb-6 text-sm  md:text-md"
      />
      <div className="w-full mx-auto flex flex-col items-center">
        <div className="w-full md:w-[400px] mx-auto mb-2">
          <TextInput
            inputLabel="Informe sua senha para confirmar a ação"
            placeholder="Informe sua senha"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            style={{ marginBottom: 4 }}
          />
          <div className="flex flex-row items-center justify-between w-full mx-auto mt-2">
            <button
              onClick={onClose}
              className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 w-48 px-4 py-2 rounded-lg  text-[13px] md:text-[14px] mr-4 h-12"
            >
              Fechar
            </button>
            <button
              onClick={onConfirmAction}
              className={`${!isPasswordValid && "opacity-75"} text-white  text-[13px] md:text-[14px] bg-red-500 px-4 py-2 rounded-lg h-12`}
              disabled={!isPasswordValid || isButtonDisabled}
            >
              Confirmar cancelamento
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
