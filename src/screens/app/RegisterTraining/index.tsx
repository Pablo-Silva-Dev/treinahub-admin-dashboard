import {
  DESCRIPTION_MIN_MESSAGE,
  FILE_MAX_SIZE_MESSAGE,
  FILE_TYPE_UNSUPPORTED_MESSAGE,
  NAME_MIN_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { FileInput } from "@/components/inputs/FileInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { RegistrationInfo } from "@/components/miscellaneous/RegistrationInfo";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import {
  IFilePreview,
  UploadedFile,
} from "@/components/miscellaneous/UploadedFile";
import { usePlan } from "@/hooks/usePlan";
import { ICreateTrainingDTO } from "@/repositories/interfaces/trainingsRepository";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface RegisterTrainingInputs {
  name: string;
  description: string;
  file: any;
  company_id: string;
}

export default function RegisterTraining() {
  const MIN_TRAINING_NAME_LENGTH = 8;
  const MIN_TRAINING_DESCRIPTION_LENGTH = 16;
  const MAX_TRAINING_DESCRIPTION_LENGTH = 500;
  const MAX_TRAINING_COVER_FILE_SIZE = 2 * 1024 * 1024; //2MB

  const [filePreview, setFilePreview] = useState<IFilePreview | null>(null);
  const [file, setFile] = useState<Blob | null>(null);
  const [wasFileUploaded, setWasFileUploaded] = useState(false);

  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();
  const { exceededStorage } = usePlan();

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepositories();
  }, []);

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(MIN_TRAINING_NAME_LENGTH, NAME_MIN_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    description: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_TRAINING_DESCRIPTION_LENGTH, DESCRIPTION_MIN_MESSAGE),
    file: yup
      .mixed()
      .required(REQUIRED_FIELD_MESSAGE)
      .test("fileSize", FILE_MAX_SIZE_MESSAGE + "2MB", (value: any) => {
        return (
          value && value[0] && value[0].size <= MAX_TRAINING_COVER_FILE_SIZE
        );
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

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

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

  const handleRegisterTraining: SubmitHandler<RegisterTrainingInputs> =
    useCallback(
      async (data: ICreateTrainingDTO) => {
        try {
          setIsLoading(true);
          if (file) {
            await trainingsRepository.createTraining({
              ...data,
              file,
              company_id: user.companyId,
            });
            showAlertSuccess("Treinamento cadastrado com sucesso!");
            reset();
            setFile(null);
            setFilePreview(null);
          }
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "STATUS" in error
          ) {
            if (error.STATUS === 409) {
              showAlertError("Já existe um treinamento com o nome informado.");
            } else {
              showAlertError("Houve um erro ao tentar cadastrar treinamento.");
            }
          }
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      },
      [file, reset, setIsLoading, trainingsRepository, user.companyId]
    );

  const descriptionValue = watch("description");

  const handleRemoveUploadedFile = () => {
    setFile(null);
    setWasFileUploaded(false);
  };

  return (
    <main className="flex flex-col bg-gray-100 dark:bg-slate-800 w-full h-full pl-[80px] mt-2">
      <div className="flex flex-col w-full">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar treinamento"
            iconName="book-open"
          />
        </div>
        <div className="w-full flex flex-col xl:flex-row justify-center mt-4">
          <RegistrationInfo
            iconName="book-open"
            infoText="Cadastrar um novo treinamento habilita a criação de videoaulas e questionários."
            registration="Treinamento"
          />
          <div className="flex flex-col items-center w-[90%] xl:w-[40vw] mr-6 xl:ml-4 bg-white dark:bg-slate-700 p-8 rounded-md">
            <form
              className="w-full"
              onSubmit={handleSubmit(handleRegisterTraining as never)}
            >
              <div className="w-full mb-4">
                <TextInput
                  inputLabel="Nome"
                  placeholder="Nome do treinamento"
                  {...register("name")}
                />
                {errors.name && (
                  <div>
                    <ErrorMessage errorMessage={errors.name?.message} />
                  </div>
                )}
              </div>

              <div className="w-full mb-4">
                <TextAreaInput
                  label="Descrição"
                  showTextLength
                  currentTextLength={
                    descriptionValue?.length ? descriptionValue.length : 0
                  }
                  maxTextLength={MAX_TRAINING_DESCRIPTION_LENGTH}
                  placeholder="Descrição do treinamento"
                  {...register("description")}
                />
                {errors.description && (
                  <div>
                    <ErrorMessage errorMessage={errors.description?.message} />
                  </div>
                )}
              </div>
              <div className="w-full mb-4">
                {wasFileUploaded && filePreview ? (
                  <UploadedFile
                    file={{
                      name: filePreview.name,
                      size: Number((filePreview.size / 1024 / 1024).toFixed(2)),
                      uri: filePreview.uri,
                      type: filePreview.type,
                    }}
                    onCancel={handleRemoveUploadedFile}
                  />
                ) : (
                  <FileInput
                    label="Capa do treinamento"
                    labelDescription="Selecione um arquivo de até 2MB"
                    onUpload={handleUploadFile}
                    {...register("file", { onChange: handleUploadFile })}
                  />
                )}
                {errors.file && (
                  <div>
                    <ErrorMessage errorMessage={errors.file?.message} />
                  </div>
                )}
              </div>
              <div className="w-full mt-2">
                <Button
                  type="submit"
                  title="Cadastrar Treinamento"
                  disabled={!isValid || isLoading || exceededStorage}
                  isLoading={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
