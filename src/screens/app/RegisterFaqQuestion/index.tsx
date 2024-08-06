import {
  ANSWER_MIN_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface RegisterFaqQuestionInputs {
  question: string;
  answer: string;
}

export function RegisterFaqQuestion() {
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
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const answerValue = watch("answer");

  const handleRegisterFaqQuestion: SubmitHandler<RegisterFaqQuestionInputs> = (
    data
  ) => {
    console.log(data);
  };

  return (
    <main className="flex flex-1 flex-col bg-gray-100 dark:bg-slate-800 w-full">
      <div className="flex flex-col items-center w-[90%] lg:w-[560px] mx-auto">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar pergunta frequente"
            iconName="help-circle"
          />
        </div>
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
              disabled={!isValid}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
