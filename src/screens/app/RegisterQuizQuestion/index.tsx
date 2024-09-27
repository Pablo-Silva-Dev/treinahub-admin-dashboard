import {
  DESCRIPTION_MIN_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { SelectInput } from "@/components/inputs/SelectInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { ICreateQuizQuestionDTO } from "@/repositories/dtos/QuestionDTO";
import { IQuizDTO } from "@/repositories/dtos/QuizDTO";
import { QuizQuestionsRepository } from "@/repositories/quizQuestionsRepository";
import { QuizzesRepository } from "@/repositories/quizzesRepository";
import { useLoading } from "@/store/loading";
import { showAlertSuccess } from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

interface RegisterQuizQuestionInputs {
  quiz_id: string;
  content: string;
}

type IOption = {
  label: string;
  value: string;
};

export function RegisterQuizQuestion() {
  const [quizzesOptionsList, setQuizzesOptionsList] = useState<IOption[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<IQuizDTO | null>(null);
  const [selectInput, setSelectInput] = useState<IOption | null>(null);

  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const MIN_QUESTION_CONTENT_LENGTH = 12;
  const MAX_QUESTION_CONTENT_LENGTH = 240;

  const validationSchema = yup.object({
    quiz_id: yup.string().required(REQUIRED_FIELD_MESSAGE),
    content: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .min(MIN_QUESTION_CONTENT_LENGTH, DESCRIPTION_MIN_MESSAGE),
  });

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const contentValue = watch("content");

  const quizzesRepository = useMemo(() => {
    return new QuizzesRepository();
  }, []);

  const quizQuestionsRepository = useMemo(() => {
    return new QuizQuestionsRepository();
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const quizIdQueryParam = queryParams.get("quizId");

  const handleQuizSelect = useCallback(
    async (selectedOption: { value: string }) => {
      setValue("quiz_id", "selectedOption.value", { shouldValidate: true });
      try {
        const quizDetails = await quizzesRepository.getQuizById(
          quizIdQueryParam ? quizIdQueryParam : selectedOption.value
        );
        if (quizDetails) {
          setSelectedQuiz(quizDetails);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [quizIdQueryParam, quizzesRepository, setValue]
  );

  const setQuizzesOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const quizzes = await quizzesRepository.listQuizzes();

      const quizzesOptions = quizzes.map((quiz) => ({
        label: "Qestionário para o treinamento de " + quiz.training.name,
        value: quiz.id,
      }));

      setQuizzesOptionsList(quizzesOptions);
    } catch (error) {
      console.log("Error at trying to list quizzes: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizzesRepository, setIsLoading]);

  const handleRegisterQuizQuestion: SubmitHandler<RegisterQuizQuestionInputs> =
    useCallback(async () => {
      try {
        setIsLoading(true);
        if (selectedQuiz && contentValue) {
          const { id } = selectedQuiz;
          const quizQuestion = await quizQuestionsRepository.createQuizQuestion(
            {
              quiz_id: id,
              content: contentValue,
            } as ICreateQuizQuestionDTO
          );
          showAlertSuccess("Pergunta cadastrada com sucesso!");
          navigate(
            `/dashboard/cadastrar-resposta?quizQuestionId=${quizQuestion.id}`
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, [
      contentValue,
      navigate,
      quizQuestionsRepository,
      selectedQuiz,
      setIsLoading,
    ]);

  const setQuizSelectOption = useCallback(async () => {
    if (quizIdQueryParam) {
      const selectedQuiz = quizzesOptionsList.find(
        (quiz) => quiz.value === quizIdQueryParam
      );
      if (selectedQuiz) {
        const quizDetails = await quizzesRepository.getQuizById(
          selectedQuiz.value
        );
        if (quizDetails) {
          setSelectedQuiz(quizDetails);
        }
        setValue("quiz_id", selectedQuiz.value, { shouldValidate: true });
        setSelectInput({
          value: selectedQuiz.value,
          label: selectedQuiz.label,
        });
      }
    }
  }, [quizIdQueryParam, quizzesOptionsList, quizzesRepository, setValue]);

  useEffect(() => {
    setQuizzesOptions();
  }, [setQuizzesOptions]);

  useEffect(() => {
    setQuizSelectOption();
  }, [setQuizSelectOption]);

  return (
    <main className="flex flex-1 flex-col bg-gray-100 dark:bg-slate-800 w-full">
      <div className="flex flex-col items-center w-[90%] lg:w-[560px] mx-auto">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar pergunta"
            iconName="play-circle"
          />
        </div>
        <form
          className="w-full"
          onSubmit={handleSubmit(handleRegisterQuizQuestion)}
        >
          <div className="w-full flex flex-col md:flex-row mb-6">
            <div className="w-full">
              <SelectInput
                label="Selecione um questionário para cadastrar uma pergunta relacionada"
                options={quizzesOptionsList}
                onSelectOption={handleQuizSelect as never}
                placeholder={
                  selectInput && selectInput.label
                    ? selectInput?.label
                    : "Selecione um questionário"
                }
                defaultValue={selectInput?.label}
                isDisabled={
                  quizIdQueryParam && quizIdQueryParam?.length > 0
                    ? true
                    : false
                }
              />
            </div>
          </div>

          <div className="w-full mt-2">
            <TextAreaInput
              label="Conteúdo da pergunta"
              placeholder="Conteúdo da pergunta. Máximo de 240 caracters"
              showTextLength
              maxTextLength={MAX_QUESTION_CONTENT_LENGTH}
              currentTextLength={contentValue ? contentValue.length : 0}
              {...register("content")}
            />
            {errors && errors.content && (
              <ErrorMessage errorMessage={errors.content?.message} />
            )}
          </div>

          <div className="w-full mt-2">
            <Button
              title="Cadastrar Pergunta"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !isValid}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
