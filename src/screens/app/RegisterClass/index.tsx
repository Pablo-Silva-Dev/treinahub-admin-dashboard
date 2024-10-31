import {
  DESCRIPTION_MIN_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
  FILE_TYPE_UNSUPPORTED_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { FileInput } from "@/components/inputs/FileInput";
import { SelectInput } from "@/components/inputs/SelectInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import {
  IFilePreview,
  UploadedFile,
} from "@/components/miscellaneous/UploadedFile";
import { ICreateVideoClassDTO } from "@/repositories/dtos/VideoClassDTO";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import {
  showAlertError,
  showAlertLoading,
  showAlertSuccess,
} from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";

interface RegisterClassInputs {
  name: string;
  description: string;
  training_id: string;
  video_file: File;
}

type IOption = {
  label: string;
  value: string;
};

export function RegisterClass() {
  const MIN_CLASS_DESCRIPTION_LENGTH = 24;
  const MAX_CLASS_DESCRIPTION_LENGTH = 500;
  const MAX_CLASS_VIDEO_FILE_SIZE = 500 * 1024 * 1024; //500MB

  const [wasVideoFileUploaded, setWasVideoFileUploaded] = useState(false);
  const [videoFilePreview, setVideoFilePreview] = useState<IFilePreview | null>(
    null
  );

  const [videoFile, setVideoFile] = useState<Blob | null>(null);
  const [trainingsOptionsList, setTrainingsOptionsList] = useState<IOption[]>(
    []
  );

  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();

  const validationSchema = yup.object({
    name: yup.string().required(REQUIRED_FIELD_MESSAGE),
    description: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_CLASS_DESCRIPTION_LENGTH, DESCRIPTION_MIN_MESSAGE),
    training_id: yup.string().required(REQUIRED_FIELD_MESSAGE),
    video_file: yup
      .mixed()
      .required(REQUIRED_FIELD_MESSAGE)
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
        return value[0].size <= MAX_CLASS_VIDEO_FILE_SIZE;
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const descriptionValue = watch("description");

  const handleTrainingSelect = (selectedOption: { value: string }) => {
    setValue("training_id", selectedOption.value, { shouldValidate: true });
  };

  const handleSelectVideoFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const videoFile = event.target.files?.[0];
    if (videoFile) {
      const previewVideoUrl = URL.createObjectURL(videoFile);
      setVideoFilePreview({
        name: videoFile.name,
        size: videoFile.size,
        uri: previewVideoUrl,
        type: videoFile.type,
      });
      setVideoFile(videoFile);
      setWasVideoFileUploaded(true);
    }
  };

  const handleRemoveUploadedFile = () => {
    setVideoFile(null);
    setWasVideoFileUploaded(false);
  };

  const setTrainingsOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const trainingsRepositories = new TrainingsRepositories();
      const trainings = await trainingsRepositories.listTrainings(
        user.companyId
      );

      const trainingsOptions = trainings.map((training) => ({
        label: training.name,
        value: training.id,
      }));

      setTrainingsOptionsList(trainingsOptions);
    } catch (error) {
      console.log("Error at trying to list trainings: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const handleRegisterVideoClass: SubmitHandler<RegisterClassInputs> =
    useCallback(
      async (data: ICreateVideoClassDTO) => {
        const videoClassesRepository = new VideoClassesRepository();
        try {
          setIsLoading(true);
          showAlertLoading(
            "Por favor, aguarde enquanto processamos a videoaula..."
          );
          if (videoFile) {
            await videoClassesRepository.createVideoClass({
              ...data,
              video_file: videoFile,
            });
            showAlertSuccess("Videoaula cadastrada com sucesso!");
          }

          reset();
          setVideoFile(null);
          setVideoFilePreview(null);
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "STATUS" in error &&
            "MSG" in error &&
            typeof error.MSG === "object" &&
            "message" in error.MSG!
          ) {
            switch (error.STATUS) {
              case 409:
                showAlertError(
                  "Já existe uma videoaula com estes dados para este treinamento."
                );
                break;
              case 406:
                if (error.MSG.message === "Video must have an audio.") {
                  showAlertError(
                    "Verifique se o arquivo de vídeo contém áudio."
                  );
                } else if (
                  error.MSG.message ===
                  "Video duration can not be more than 15 minutes."
                ) {
                  showAlertError(
                    "A videoaula não pode conter mais que 15 minutos de duração."
                  );
                }
                break;
              default:
                showAlertError(
                  "Houve um erro ao tentar cadastrar a videoaula."
                );
            }
          } else {
            showAlertError("Houve um erro ao tentar cadastrar a videoaula.");
          }
          console.log(error);
        } finally {
          setIsLoading(false);
          toast.dismiss("loading");
        }
      },
      [setIsLoading, videoFile, reset]
    );

  useEffect(() => {
    setTrainingsOptions();
  }, [setTrainingsOptions]);

  return (
    <main className="flex flex-1 flex-col bg-gray-100 dark:bg-slate-800 w-full">
      <div className="flex flex-col items-center w-[90%] lg:w-[560px] mx-auto">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar videoaula"
            iconName="play-circle"
          />
        </div>
        <form
          className="w-full"
          onSubmit={handleSubmit(handleRegisterVideoClass as never)}
        >
          <div className="w-full mb-4">
            <TextInput
              inputLabel="Nome"
              placeholder="Nome do aula"
              {...register("name")}
            />
            {errors && errors.name && (
              <ErrorMessage errorMessage={errors.name?.message} />
            )}
          </div>
          <div className="w-full mb-6">
            <TextAreaInput
              label="Descrição"
              showTextLength
              currentTextLength={descriptionValue ? descriptionValue.length : 0}
              maxTextLength={MAX_CLASS_DESCRIPTION_LENGTH}
              placeholder="Descrição do aula"
              {...register("description")}
            />
            {errors && errors.description && (
              <ErrorMessage errorMessage={errors.description?.message} />
            )}
          </div>

          <div className="w-full mb-2">
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
                  onUpload={handleSelectVideoFile}
                  buttonTitle="Selecione um arquivo de vídeo"
                  labelDescription="Selecione um arquivo de video .mp4 ou .mov de até 50MB"
                  {...register("video_file", {
                    onChange: handleSelectVideoFile as never,
                  })}
                />
                {errors && errors.video_file && (
                  <ErrorMessage errorMessage={errors.video_file?.message} />
                )}
              </>
            )}
          </div>

          <div className="w-full flex flex-col md:flex-row mb-6">
            <div className="w-full">
              <SelectInput
                label="Selecione um treinamento"
                options={trainingsOptionsList}
                onSelectOption={handleTrainingSelect as never}
                placeholder="Selecione um treinamento"
                defaultValue="Selecione um treinamento"
                widthVariant="mid"
              />
            </div>
          </div>

          <div className="w-full mt-2">
            <Button
              title="Cadastrar Aula"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !isValid || !videoFile}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
