import {
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { phoneMask } from "@/utils/masks";
import { phoneValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardEvent, MouseEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";
import { ManageSupportContactInputs } from "../..";

interface EditSupportContactModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onClose: () => void;
}

export function EditSupportContactModal({
  isOpen,
  onRequestClose,
  onClose,
}: EditSupportContactModalProps) {
  const { theme } = useThemeStore();

  const validationSchema = yup.object({
    phone: yup
      .string()
      .matches(phoneValidationRegex, PHONE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const handleUpdateSupportContact: SubmitHandler<
    ManageSupportContactInputs
  > = (data) => {
    console.log(data);
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
        content="Atualização de contato de suporte"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <form
        className="w-full"
        onSubmit={handleSubmit(handleUpdateSupportContact)}
      >
        <MaskedTextInput
          inputLabel="Telefone"
          placeholder="Telefone do contato"
          mask={phoneMask}
          inputMode="numeric"
          {...register("phone")}
        />
        {errors && errors.phone && (
          <ErrorMessage errorMessage={errors.phone?.message} />
        )}

        <div className="w-full mt-4">
          <Button type="submit" title="Salvar dados" disabled={!isValid} />
        </div>
      </form>
      <button
        onClick={onClose}
        className="text-black dark:text-white bg-gray-200 dark:bg-slate-700  p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
      >
        Cancelar
      </button>
    </Modal>
  );
}
