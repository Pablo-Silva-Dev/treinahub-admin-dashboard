import {
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { phoneMask } from "@/utils/masks";
import { phoneValidationRegex } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import * as yup from "yup";
import { EditSupportContactModal } from "./components/EditSupportContact";

export interface ManageSupportContactInputs {
  phone: string;
}

export function ManageSupportContact() {
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

  const handleManageSupportContact: SubmitHandler<
    ManageSupportContactInputs
  > = (data) => {
    console.log(data);
  };

  //TODO-Pablo: Check if there is a registered contact from back-end
  const [supportContactPhone] = useState("(31)985187963");
  const [isEditSupportContactModalOpen, setIsEditModalSupportContactOpen] =
    useState(false);

  const handleToggleEditSupportContactModal = () => {
    setIsEditModalSupportContactOpen(!isEditSupportContactModalOpen);
  };

  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <div className="mt-3 mb-4 w-full">
        <ScreenTitleIcon
          screenTitle="Gerenciar contato de suporte"
          iconName="help-circle"
        />
      </div>
      {supportContactPhone ? (
        <>
          <div className="w-[90%] mt-2 flex flex-col bg-white dark:bg-slate-700 shadow-md rounded-md p-4">
            <span className="text-gray-700 dark:text-gray-100 text-[12px] md:text-[16px] mb-2">
              Contato cadastrado:
            </span>
            <div className="flex flex-row items-center">
              <span className="text-gray-600 dark:text-gray-300 text-[12px] md:text-[16px]">
                {supportContactPhone}
              </span>
              <button
                className="ml-3"
                onClick={handleToggleEditSupportContactModal}
              >
                <MdEdit className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-gray-50" />
              </button>
            </div>
          </div>
          <EditSupportContactModal
            isOpen={isEditSupportContactModalOpen}
            onClose={handleToggleEditSupportContactModal}
            onRequestClose={handleToggleEditSupportContactModal}
          />
        </>
      ) : (
        <form
          className="w-full mt-5"
          onSubmit={handleSubmit(handleManageSupportContact)}
        >
          <div className="w-full">
            <MaskedTextInput
              inputLabel="Telefone"
              placeholder="Telefone do contato"
              mask={phoneMask}
              style={{ width: "99%" }}
              inputMode="numeric"
              {...register("phone")}
            />
            {errors && errors.phone && (
              <ErrorMessage errorMessage={errors.phone?.message} />
            )}
          </div>
          <div className="w-full mt-4">
            <Button
              title="Cadastrar contato"
              type="submit"
              disabled={!isValid}
            />
          </div>
        </form>
      )}
    </div>
  );
}
