import {
  EMAIL_INVALID_MESSAGE,
  PHONE_INVALID_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { TextInput } from "@/components/inputs/TextInput";
import { Title } from "@/components/typography/Title";
import { IUpdateContactSupportDTO } from "@/repositories/dtos/ContactSupportDTO";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { phoneMask } from "@/utils/masks";
import { maskedPhoneValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@material-tailwind/react";
import { KeyboardEvent, MouseEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";
interface UpdateSupportContactInputs {
  id: string;
  name?: string;
  contact_number?: string;
  email?: string;
  hide_contact_number?: boolean;
}

interface IContactData {
  name?: string;
  contact_number?: string;
  email?: string;
  hide_contact_number?: boolean;
}

interface EditSupportContactModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onClose: () => void;
  onConfirmAction: (contact: IUpdateContactSupportDTO) => void;
  selectedContactSupportId: string | null;
  contactData: IContactData;
}

export function EditSupportContactModal({
  isOpen,
  onRequestClose,
  onClose,
  onConfirmAction,
  selectedContactSupportId,
  contactData,
}: EditSupportContactModalProps) {
  const { theme } = useThemeStore();

  const validationSchema = yup.object({
    id: yup.string(),
    name: yup.string(),
    email: yup.string().email(EMAIL_INVALID_MESSAGE),
    contact_number: yup
      .string()
      .matches(maskedPhoneValidationRegex, PHONE_INVALID_MESSAGE),
    hide_contact_number: yup.boolean(),
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

  const [hideContactNumber, setHideContactNumber] = useState(false);

  const handleUpdateSupportContact: SubmitHandler<
    UpdateSupportContactInputs
  > = (data: UpdateSupportContactInputs) => {
    onConfirmAction({
      ...data,
      id: selectedContactSupportId!,
      hide_contact_number: hideContactNumber,
    });
  };

  useEffect(() => {
    if (contactData) {
      reset({
        name: contactData.name,
        contact_number: contactData.contact_number,
        email: contactData.email,
        hide_contact_number: contactData.hide_contact_number,
      });
      setHideContactNumber(contactData.hide_contact_number!);
    }
  }, [contactData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualizar contato de suporte"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <form
        className="w-full"
        onSubmit={handleSubmit(handleUpdateSupportContact as never)}
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
        <MaskedTextInput
          inputLabel="Telefone"
          placeholder="Telefone do contato"
          mask={phoneMask}
          inputMode="numeric"
          {...register("contact_number")}
        />
        {errors && errors.contact_number && (
          <ErrorMessage errorMessage={errors.contact_number?.message} />
        )}
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

        <div className="w-full mt-4">
          <Checkbox
            onClick={() => setHideContactNumber(!hideContactNumber)}
            defaultChecked={hideContactNumber}
            color="blue"
          />
        </div>
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
