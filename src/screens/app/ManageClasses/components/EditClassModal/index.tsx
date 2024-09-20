import {
  DESCRIPTION_MIN_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
  FILE_TYPE_UNSUPPORTED_MESSAGE,
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
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
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
  useMemo,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Modal from "react-modal";
import * as yup from "yup";

interface UpdateVideoClassInputs {
  id?: string;
  training_id?: string;
  name?: string;
  description?: string;
  video_file?: any;
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trainingId, setTrainingId] = useState("");
  const [wasVideoFileUploaded, setWasVideoFileUploaded] = useState(false);
  const [videoFile, setVideoFile] = useState<Blob | null>(null);

  const [videoFilePreview, setVideoFilePreview] = useState<IFilePreview | null>(
    null
  );

  const { theme } = useThemeStore();

  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const MIN_TRAINING_NAME_LENGTH = 16;
  const MIN_TRAINING_DESCRIPTION_LENGTH = 40;
  const MAX_TRAINING_DESCRIPTION_LENGTH = 500;
  const MAX_VIDEO_FILE_SIZE = 500 * 1024 * 1024; //500MB

  const validationSchema = yup.object({
    id: yup.string().optional(),
    training_id: yup.string().optional(),
    name: yup
      .string()
      .min(MIN_TRAINING_NAME_LENGTH, DESCRIPTION_MIN_MESSAGE)
      .optional(),
    description: yup
      .string()
      .optional()
      .min(MIN_TRAINING_DESCRIPTION_LENGTH, DESCRIPTION_MIN_MESSAGE)
      .max(MAX_TRAINING_DESCRIPTION_LENGTH),
    video_file: yup
      .mixed()
      .optional()
      .test(
        "fileType",
        FILE_TYPE_UNSUPPORTED_MESSAGE + ".mp4, .mov, .avi, .mkv, .webm, .flv",
        (value: any) => {
          if (!value || value.length === 0) return true;
          return (
            value &&
            value[0] &&
            [
              "video/mp4",
              "video/quicktime",
              "video/x-msvideo",
              "video/x-matroska",
              "video/webm",
              "video/x-flv",
            ].includes(value[0].type)
          );
        }
      )
      .test("fileSize", FILE_MAX_SIZE_MESSAGE + "500MB", (value: any) => {
        if (!value || value.length === 0) return true; // Allow empty file
        return value[0].size <= MAX_VIDEO_FILE_SIZE;
      }),
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

  const handleUploadVideoFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoFilePreview({
        name: file.name,
        size: file.size,
        uri: previewUrl,
        type: file.type,
      });
      setVideoFile(file);
      setWasVideoFileUploaded(true);
    }
  };

  const handleRemoveUploadedFile = () => {
    setWasVideoFileUploaded(false);
    setVideoFilePreview(null);
  };

  const getVideoClassDetails = useCallback(async () => {
    try {
      const videoClass = await videoClassesRepository.getVideoClassById(
        selectedVideoClassId!
      );
      setName(videoClass.name);
      setDescription(videoClass.description);
      setTrainingId(videoClass.training_id);
    } catch (error) {
      console.log(error);
    }
  }, [selectedVideoClassId, videoClassesRepository]);

  console.log(trainingId);

  const handleUpdateVideoClass: SubmitHandler<UpdateVideoClassInputs> = (
    data: UpdateVideoClassInputs
  ) => {
    const updatedData = videoFile
      ? {
          ...data,
          id: selectedVideoClassId,
          video_file: videoFile,
          training_id: trainingId,
        }
      : {
          id: selectedVideoClassId,
          name: data.name,
          description: data.description,
          training_id: trainingId,
        };
    onConfirmAction(updatedData);
    reset();
    setVideoFilePreview(null);
    setVideoFile(null);
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
        content="Atualização dos dados do aula"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você pode alterar o nome, descrição,"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />
      <Subtitle
        content=" e/ou reenviar um novo arquivo de vídeo"
        className="text-center text-gray-700 dark:text-gray-100  text-[13px] md:text-[14px]"
      />

      <form onSubmit={handleSubmit(handleUpdateVideoClass)} className="my-4">
        <TextInput
          inputLabel="Nome"
          placeholder="Nome da videoaula"
          {...register("name")}
          defaultValue={name}
        />
        {errors && errors.name && (
          <ErrorMessage errorMessage={errors.name?.message} />
        )}
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
        <div className="my-4">
          {wasVideoFileUploaded && videoFilePreview ? (
            <>
              <UploadedFile
                file={{
                  name: videoFilePreview.name,
                  size: Number(
                    (videoFilePreview.size / 1024 / 1024).toFixed(2)
                  ),
                  uri: videoFilePreview.uri,
                  type: videoFilePreview.type,
                }}
                onCancel={handleRemoveUploadedFile}
              />
              {errors && errors.video_file && (
                <ErrorMessage errorMessage={errors.video_file?.message} />
              )}
            </>
          ) : (
            <>
              <FileInput
                label="Videoaula"
                placeholder="Selecione uma nova videoaula"
                buttonTitle="Slecione um arquivo de vídeo"
                labelDescription="Selecione um arquivo de vídeo de até 50MB"
                {...register("video_file", { onChange: handleUploadVideoFile })}
              />
              {errors && errors.video_file && (
                <ErrorMessage errorMessage={errors.video_file?.message} />
              )}
            </>
          )}
        </div>
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
