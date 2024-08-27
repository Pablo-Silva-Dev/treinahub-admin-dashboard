import {
  DESCRIPTION_MIN_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
  FILE_TYPE_UNSUPPORTED_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { FileInput } from "@/components/inputs/FileInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import {
  IFilePreview,
  UploadedFile,
} from "@/components/miscellaneous/UploadedFile";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

interface UpdateTrainingInputs {
  id?: string;
  name: string;
  description: string;
  file?: any;
}

interface EditTrainingModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (param: any) => void;
  onClose: () => void;
  isLoading: boolean;
  selectedTrainingId: string | null;
}

export function EditTrainingModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  isLoading,
  selectedTrainingId,
}: EditTrainingModalProps) {
  const MIN_COURSE_NAME_LENGTH = 16;
  const MIN_COURSE_DESCRIPTION_LENGTH = 40;
  const MAX_COURSE_DESCRIPTION_LENGTH = 500;
  const MAX_COURSE_COVER_FILE_SIZE = 2 * 1024 * 1024; //2MB

  const [filePreview, setFilePreview] = useState<IFilePreview | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [wasFileUploaded, setWasFileUploaded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const validationSchema = yup.object({
    id: yup.string().optional(),
    name: yup
      .string()
      .min(MIN_COURSE_NAME_LENGTH, DESCRIPTION_MIN_MESSAGE)
      .required(),
    description: yup
      .string()
      .required()
      .min(MIN_COURSE_DESCRIPTION_LENGTH, DESCRIPTION_MIN_MESSAGE)
      .max(MAX_COURSE_DESCRIPTION_LENGTH),
    file: yup
      .mixed()
      .required(REQUIRED_FIELD_MESSAGE)
      .test("fileSize", FILE_MAX_SIZE_MESSAGE + "2MB", (value: any) => {
        return value && value[0] && value[0].size <= MAX_COURSE_COVER_FILE_SIZE;
      })
      .test(
        "fileType",
        FILE_TYPE_UNSUPPORTED_MESSAGE + ".jpeg ou .png",
        (value: any) => {
          return (
            value &&
            value[0] &&
            ["image/jpeg", "image/png"].includes(value[0].type)
          );
        }
      ),
  });

  const { theme } = useThemeStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const descriptionValue = watch("description");

  const handleUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFilePreview({
        name: file.name,
        size: file.size,
        uri: previewUrl,
        type: file.type,
      });
      setFile(file);
      setWasFileUploaded(true);
    }
  };

  const handleRemoveUploadedFile = () => {
    setFile(null);
    setWasFileUploaded(false);
  };

  const handleUpdateTraining: SubmitHandler<UpdateTrainingInputs> = (
    data: UpdateTrainingInputs
  ) => {
    onConfirmAction({ ...data, id: selectedTrainingId, file });
    reset();
    setFilePreview(null);
    setFile(null);
  };

  const getTrainingDetails = useCallback(async () => {
    const trainingsRepository = new TrainingsRepositories();
    try {
      const trainingDetails = await trainingsRepository.getTrainingById(
        selectedTrainingId!
      );
      setName(trainingDetails.name);
      setDescription(trainingDetails.description);
    } catch (error) {
      console.log(error);
    }
  }, [selectedTrainingId]);

  useEffect(() => {
    getTrainingDetails();
  }, [getTrainingDetails]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualização dos dados do treinamento"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar o nome, descrição e imagem de capa do treinamento"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />

      <form onSubmit={handleSubmit(handleUpdateTraining)} className="my-4">
        <TextInput inputLabel="Nome" placeholder={name} {...register("name")} />
        {errors.name && (
          <div>
            <ErrorMessage errorMessage={errors.name?.message} />
          </div>
        )}
        <div className="my-4">
          <TextAreaInput
            label="Descrição"
            placeholder={description}
            showTextLength
            maxTextLength={MAX_COURSE_DESCRIPTION_LENGTH}
            currentTextLength={
              descriptionValue?.length ? descriptionValue.length : 0
            }
            {...register("description")}
          />
          {errors.description && (
            <div>
              <ErrorMessage errorMessage={errors.description?.message} />
            </div>
          )}
        </div>
        <div className="mt-4 mb-8">
          {wasFileUploaded && filePreview ? (
            <>
              <UploadedFile
                file={{
                  name: filePreview.name,
                  size: Number((filePreview.size / 1024 / 1024).toFixed(2)),
                  uri: filePreview.uri,
                  type: filePreview.type,
                }}
                onCancel={handleRemoveUploadedFile}
              />
              {errors.file && (
                <div>
                  <ErrorMessage errorMessage={errors.file?.message} />
                </div>
              )}
            </>
          ) : (
            <>
              <FileInput
                label="Capa do treinamento"
                labelDescription="Tamanho máximo do arquivo: 2MB"
                {...register("file", { onChange: handleUploadFile })}
              />
              {errors.file && (
                <div>
                  <ErrorMessage errorMessage={errors.file?.message} />
                </div>
              )}
            </>
          )}
        </div>
        <Button
          title="Salvar dados"
          onClick={onConfirmAction}
          type="submit"
          disabled={!isValid || isLoading}
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
