import {
  ANSWER_MIN_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { yupResolver } from "@hookform/resolvers/yup";
import { KeyboardEvent, MouseEvent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

interface EditFaqQuestionModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onClose: () => void;
}

export interface UpdateFaqQuestionInputs {
  question: string;
  answer: string;
}

export function EditFaqQuestionModal({
  isOpen,
  onRequestClose,
  onClose,
}: EditFaqQuestionModalProps) {
  const { theme } = useThemeStore();

  const MIN_QUESTION_SIZE = 24;

  const validationSchema = yup.object({
    question: yup.string().required(REQUIRED_FIELD_MESSAGE),
    answer: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_QUESTION_SIZE, ANSWER_MIN_MESSAGE),
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

  const handleUpdateFaqQuestion: SubmitHandler<UpdateFaqQuestionInputs> = (
    data
  ) => {
    console.log(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
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
        content="Atualização de pergunta frequente"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar o conteúdo da pergunta e/ou resposta"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />
      <form onSubmit={handleSubmit(handleUpdateFaqQuestion)}>
        <div className="my-4">
          <TextInput
            inputLabel="Pergunta"
            placeholder="Conteúdo da pergunta"
            {...register("question")}
          />
          {errors && errors.question && (
            <ErrorMessage errorMessage={errors.question?.message} />
          )}
        </div>
        <div className="my-4">
          <TextAreaInput
            label="Resposta"
            placeholder="Conteúdo da resposta"
            {...register("answer")}
          />
          {errors && errors.answer && (
            <ErrorMessage errorMessage={errors.answer?.message} />
          )}
        </div>
        <div className="w-full mt-6">
          <Button title="Salvar dados" type="submit" disabled={!isValid} />
        </div>
      </form>
      <button
        onClick={handleClose}
        className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
      >
        Cancelar
      </button>
    </Modal>
  );
}
