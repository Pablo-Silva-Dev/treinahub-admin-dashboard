import {
  ANSWER_MIN_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { RegistrationInfo } from "@/components/miscellaneous/RegistrationInfo";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { FaqQuestionsRepository } from "@/repositories/faqQuestionsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface RegisterFaqQuestionInputs {
  question: string;
  answer: string;
}

export default function RegisterFaqQuestion() {
  const MIN_TEXT_LENGTH = 24;
  const MAX_TEXT_LENGTH = 500;

  const validationSchema = yup.object({
    question: yup.string().required(REQUIRED_FIELD_MESSAGE),
    answer: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_TEXT_LENGTH, ANSWER_MIN_MESSAGE),
  });

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

  const answerValue = watch("answer");

  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();

  const faqQuestionsRepository = useMemo(() => {
    return new FaqQuestionsRepository();
  }, []);

  const handleRegisterFaqQuestion: SubmitHandler<
    RegisterFaqQuestionInputs
  > = async (data) => {
    try {
      setIsLoading(true);
      await faqQuestionsRepository.createFaqQuestion({
        ...data,
        company_id: user.companyId,
      });
      showAlertSuccess("Pergunta cadastrada com sucesso!");
      reset();
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        if (error.STATUS === 409) {
          showAlertError("Já existe uma pergunta com os dados fornecidos.");
        }
      } else {
        showAlertError(
          "Houve um erro ao tentar atualizar pergunta. Por favor, tente novamente mais tarde."
        );
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col bg-gray-100 dark:bg-slate-800 w-full h-full pl-[80px] mt-2">
      <div className="flex flex-col w-full">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar pergunta frequente"
            iconName="help-circle"
          />
        </div>
        <div className="w-full flex flex-col xl:flex-row justify-center mt-4">
          <RegistrationInfo
            iconName="help-circle"
            infoText="Cadastre uma pergunta frequente para responder uma possível dúvida que seu colaborador possa ter."
            registration="Pergunta frequente"
          />
          <div className="flex flex-col items-center w-[90%] xl:w-[40vw] mr-6 xl:ml-4 bg-white dark:bg-slate-700 p-8 rounded-md">
            <form
              className="w-full"
              onSubmit={handleSubmit(handleRegisterFaqQuestion)}
            >
              <div className="w-full mb-4">
                <TextInput
                  inputLabel="Pergunta"
                  placeholder="Conteúdo da pergunta"
                  {...register("question")}
                />
                {errors && errors.question && (
                  <ErrorMessage errorMessage={errors.question?.message} />
                )}
              </div>
              <div className="w-full mb-4">
                <TextAreaInput
                  label="Resposta"
                  showTextLength
                  currentTextLength={answerValue ? answerValue.length : 0}
                  maxTextLength={MAX_TEXT_LENGTH}
                  placeholder="Conteúdo da resposta"
                  {...register("answer")}
                />
                {errors && errors.answer && (
                  <ErrorMessage errorMessage={errors.answer?.message} />
                )}
              </div>
              <div className="w-full mt-2">
                <Button
                  title="Cadastrar pergunta"
                  type="submit"
                  disabled={!isValid || isLoading}
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
