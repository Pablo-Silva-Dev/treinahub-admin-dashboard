import { DESCRIPTION_MIN_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
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

interface UpdateVideoClassInputs {
  id?: string;
  training_id?: string;
  description?: string;
}

interface EditClassModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
  isLoading: boolean;
  selectedVideoClassId: string | null;
}

export function EditClassModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  isLoading,
  selectedVideoClassId,
}: EditClassModalProps) {
  const [description, setDescription] = useState("");
  const [trainingId, setTrainingId] = useState("");

  const { theme } = useThemeStore();

  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const MIN_TRAINING_DESCRIPTION_LENGTH = 16;
  const MAX_TRAINING_DESCRIPTION_LENGTH = 500;

  const validationSchema = yup.object({
    id: yup.string().optional(),
    training_id: yup.string().optional(),
    description: yup
      .string()
      .optional()
      .min(MIN_TRAINING_DESCRIPTION_LENGTH, DESCRIPTION_MIN_MESSAGE)
      .max(MAX_TRAINING_DESCRIPTION_LENGTH),
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

  const getVideoClassDetails = useCallback(async () => {
    try {
      if (selectedVideoClassId) {
        const videoClass =
          await videoClassesRepository.getVideoClassById(selectedVideoClassId);
        setDescription(videoClass.description);
        setTrainingId(videoClass.training_id);
      }
    } catch (error) {
      console.log(error);
    }
  }, [selectedVideoClassId, videoClassesRepository]);

  const handleUpdateVideoClass: SubmitHandler<UpdateVideoClassInputs> = (
    data: UpdateVideoClassInputs
  ) => {
    const updatedData = {
      ...data,
      id: selectedVideoClassId,
      training_id: trainingId,
    };

    onConfirmAction(updatedData);
    reset();
    onClose();
  };

  useEffect(() => {
    getVideoClassDetails();
  }, [getVideoClassDetails]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualização dos dados da aula"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar a descrição da aula. Para atualizar o nome ou o conteúdo da aula é necessário remover a aula e realizar um novo upload."
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />
      <form onSubmit={handleSubmit(handleUpdateVideoClass)} className="my-4">
        <div className="my-4">
          <TextAreaInput
            label="Descrição"
            placeholder="Descrição da videoaula"
            defaultValue={description}
            {...register("description")}
          />
          {errors && errors.description && (
            <ErrorMessage errorMessage={errors.description?.message} />
          )}
        </div>
        <div className="my-4"></div>
        <Button
          title="Salvar dados"
          onClick={onConfirmAction}
          isLoading={isLoading}
          type="submit"
          disabled={isLoading || !isValid}
        />
        <button
          onClick={onClose}
          className="text-black dark:text-white bg-gray-200 dark:bg-slate-700  p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
        >
          Cancelar
        </button>
      </form>
    </Modal>
  );
}
