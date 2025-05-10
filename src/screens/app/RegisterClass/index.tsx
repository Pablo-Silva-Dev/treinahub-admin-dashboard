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
import { RegistrationInfo } from "@/components/miscellaneous/RegistrationInfo";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import {
  IFilePreview,
  UploadedFile,
} from "@/components/miscellaneous/UploadedFile";
import { usePlan } from "@/hooks/usePlan";
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

export default function RegisterClass() {
  const MIN_CLASS_DESCRIPTION_LENGTH = 24;
  const MAX_CLASS_DESCRIPTION_LENGTH = 500;
  const MAX_CLASS_VIDEO_FILE_SIZE = 250 * 1024 * 1024; //250MB

  const [wasVideoFileUploaded, setWasVideoFileUploaded] = useState(false);
  const [videoFilePreview, setVideoFilePreview] = useState<IFilePreview | null>(
    null
  );

  const [videoFile, setVideoFile] = useState<Blob | null>(null);
  const [trainingsOptionsList, setTrainingsOptionsList] = useState<IOption[]>(
    []
  );
  const [, setSelectedTrainingId] = useState("");

  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();
  const { exceededStorage } = usePlan();

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
      .test("fileSize", FILE_MAX_SIZE_MESSAGE + "250MB", (value: any) => {
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
    setSelectedTrainingId(selectedOption.value);
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
  }, [setIsLoading, user.companyId]);

  const handleRegisterVideoClass: SubmitHandler<RegisterClassInputs> =
    useCallback(
      async (data: ICreateVideoClassDTO) => {
        const videoClassesRepository = new VideoClassesRepository();
        try {
          setIsLoading(true);
          showAlertLoading(
            "Estamos fazendo o upload da videoaula. Você pode continuar utilizando a plataforma enquanto fazemos seu upload."
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
                showAlertError(
                  "O vídeo enviado não atende aos critérios de tamanho e formato. Verifique se o vídeo possui áudio e  o arquivo não ultrapassa 150MB."
                );
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
    <main className="flex flex-col bg-gray-100 dark:bg-slate-800 w-full h-full pl-[80px] mt-2">
      <div className="flex flex-col w-full">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar videoaula"
            iconName="play-circle"
          />
        </div>
        <div className="w-full flex flex-col xl:flex-row justify-center mt-4">
          <RegistrationInfo
            iconName="play-circle"
            infoText="Cadastrar uma video aula a um treinamento. A videoaula estará disponível para seus colaboradores no treinamento vinculado após o processamento do vídeo."
            infoTextSecondary=" Este processo pode levar alguns minutos, a depender do tamanho do arquivo enviado e disponibilidade do servidor."
            registration="Videoaula"
          />
      
          <div className="flex flex-col items-center w-[90%] xl:w-[40vw] mr-6 xl:ml-4 bg-white dark:bg-slate-700 p-8 rounded-md">
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
                  currentTextLength={
                    descriptionValue ? descriptionValue.length : 0
                  }
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
                      labelDescription="Selecione um arquivo de video de até 250MB que seja compatível com os formatos suportados. Formatos suportados: .mp4, .mov, .avi, .mkv, .webm ou .flv."
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

              <div className="w-full mb-2">
                <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm mb-2">
                  * Máximo de 250MB
                </span>
              </div>
              <div className="w-full mb-4">
                <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm">
                  * O tamanho final do arquivo pode ser de pelo menos 2 vezes
                  superior ao tamanho do arquivo original devido aos arquivos
                  adicionais gerados pelo processo de encoding necessário para
                  tornar seu vídeo reproduzível no player de vídeo.
                </span>
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
                  disabled={
                    isLoading || !isValid || !videoFile || exceededStorage
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
