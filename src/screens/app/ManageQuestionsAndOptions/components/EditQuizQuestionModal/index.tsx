import { DESCRIPTION_MIN_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { IUpdateQuizQuestionDTO } from "@/repositories/dtos/QuestionDTO";
import { QuizQuestionsRepository } from "@/repositories/quizQuestionsRepository";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

interface UpdateQuizQuestionInputs {
  id: string;
  content?: string;
}

interface EditQuizQuestionModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
  isLoading: boolean;
  selectedQuizQuestionId: string | null;
}

export function EditQuizQuestionModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  isLoading,
  selectedQuizQuestionId,
}: EditQuizQuestionModalProps) {
  const [content, setContent] = useState("");

  const { theme } = useThemeStore();

  const quizQuestionsRepository = useMemo(() => {
    return new QuizQuestionsRepository();
  }, []);

  const MIN_CONTENT_NAME_LENGTH = 16;
  const MAX_TRAINING_DESCRIPTION_LENGTH = 500;

  const validationSchema = yup.object({
    id: yup.string(),
    content: yup
      .string()
      .min(MIN_CONTENT_NAME_LENGTH, DESCRIPTION_MIN_MESSAGE)
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const getQuizQuestionsDetails = useCallback(async () => {
    try {
      if (selectedQuizQuestionId) {
        const quizQuestion = await quizQuestionsRepository.getQuizQuestionById(
          selectedQuizQuestionId!
        );
        setContent(quizQuestion.content);
      }
    } catch (error) {
      console.log(error);
    }
  }, [quizQuestionsRepository, selectedQuizQuestionId]);

  useEffect(() => {
    getQuizQuestionsDetails();
  }, [getQuizQuestionsDetails]);

  const handleUpdateQuizQuestions: SubmitHandler<UpdateQuizQuestionInputs> = (
    data: IUpdateQuizQuestionDTO
  ) => {
    if (selectedQuizQuestionId) {
      const updatedData = {
        ...data,
        id: selectedQuizQuestionId,
      };
      onConfirmAction(updatedData);
      onClose();
    }
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
        content="Atualização da pergunta"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar o conteúdo da pergunta"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />
      <form
        onSubmit={handleSubmit(handleUpdateQuizQuestions as never)}
        className="my-4"
      >
        <TextAreaInput
          label="Pergunta"
          placeholder="Conteúdo da pergunta"
          maxLength={MAX_TRAINING_DESCRIPTION_LENGTH}
          showTextLength
          currentTextLength={MAX_TRAINING_DESCRIPTION_LENGTH - content.length}
          {...register("content")}
          defaultValue={content}
        />
        {errors && errors.content && (
          <ErrorMessage errorMessage={errors.content?.message} />
        )}
        <div className="my-4"></div>
        <Button
          title="Salvar dados"
          onClick={onConfirmAction}
          isLoading={isLoading}
          type="submit"
          disabled={isLoading || !isValid}
        />
        <button
          type="button"
          onClick={onClose}
          className="text-black dark:text-white bg-gray-200 dark:bg-slate-700  p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
        >
          Cancelar
        </button>
      </form>
    </Modal>
  );
}
