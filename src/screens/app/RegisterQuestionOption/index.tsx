import { REQUIRED_FIELD_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Switcher } from "@/components/inputs/Switch";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { RegistrationInfo } from "@/components/miscellaneous/RegistrationInfo";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { IQuizQuestionDTO } from "@/repositories/dtos/QuestionDTO";
import {
  ICreateQuestionOptionDTO,
  IQuestionOptionDTO,
} from "@/repositories/dtos/QuestionOptionDTO";
import { IQuizDTO } from "@/repositories/dtos/QuizDTO";
import { QuestionOptionsRepository } from "@/repositories/questionOptionsRepository";
import { QuizQuestionsRepository } from "@/repositories/quizQuestionsRepository";
import { QuizzesRepository } from "@/repositories/quizzesRepository";
import { useLoading } from "@/store/loading";
import { showAlertSuccess } from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { QuestionOptionsList } from "./components";

interface RegisterQuestionOptionInputs {
  question_id: string;
  content: string;
}

type IOption = {
  label: string;
  value: string;
};

export default function RegisterQuestionOption() {
  const [questionOptionsList, setQuestionOptionsList] = useState<IOption[]>([]);
  const [quizzesOptionsList, setQuizzesOptionsList] = useState<IOption[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<IQuizDTO | null>(null);
  const [selectedQuizQuestion, setSelectedQuizQuestion] =
    useState<IQuizQuestionDTO | null>(null);
  const [selectedQuestionOption, setSelectedQuestionOption] =
    useState<IQuestionOptionDTO | null>(null);
  const [selectQuizInput, setSelectQuizInput] = useState<IOption | null>(null);
  const [selectQuizQuestionInput, setSelectQuizQuestionInput] =
    useState<IOption | null>(null);
  const [questionOptions, setQuestionOptions] = useState<IQuestionOptionDTO[]>(
    []
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [correctOptionSwitch, setCorrectOptionSwitch] = useState(false);
  const [showRegisteredOptions, setShowRegisteredOptions] = useState(false);

  const navigate = useNavigate();

  const { isLoading, setIsLoading } = useLoading();
  const MAX_OPTION_CONTENT_LENGTH = 120;
  const MIN_QUESTION_OPTIONS = 2;
  const MAX_QUESTION_OPTIONS = 4;

  const validationSchema = yup.object({
    question_id: yup.string().required(REQUIRED_FIELD_MESSAGE),
    content: yup.string().required(REQUIRED_FIELD_MESSAGE),
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

  const questionsOptionsRepository = useMemo(() => {
    return new QuestionOptionsRepository();
  }, []);

  const quizQuestionsRepository = useMemo(() => {
    return new QuizQuestionsRepository();
  }, []);

  const questionOptionsRepository = useMemo(() => {
    return new QuestionOptionsRepository();
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const quizIdQueryParam = queryParams.get("quizId");
  const quizQuestionIdQueryParam = queryParams.get("quizQuestionId");

  const handleQuizSelect = useCallback(
    async (selectedOption: { value: string }) => {
      setValue("question_id", selectedOption.value, { shouldValidate: true });
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

  const handleQuizQuestionSelect = useCallback(
    async (selectedOption: { value: string }) => {
      try {
        const quizQuestionDetails =
          await quizQuestionsRepository.getQuizQuestionById(
            quizQuestionIdQueryParam
              ? quizQuestionIdQueryParam
              : selectedOption.value
          );
        if (quizQuestionDetails) {
          setSelectedQuizQuestion(quizQuestionDetails);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [quizQuestionIdQueryParam, quizQuestionsRepository]
  );

  const setQuizzesOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const quizzes = await quizzesRepository.listQuizzes();

      const quizzesOptions = quizzes.map((quiz) => ({
        label: quiz.training.name,
        value: quiz.id,
      }));
      setQuizzesOptionsList(quizzesOptions);
    } catch (error) {
      console.log("Error at trying to list trainings: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizzesRepository, setIsLoading]);

  const setQuizzesQuestionsOptions = useCallback(async () => {
    try {
      setIsLoading(true);

      if (selectedQuiz) {
        const quizzesQuestions =
          await quizQuestionsRepository.listQuizQuestionsByQuiz(
            selectedQuiz.id
          );

        const questions = quizzesQuestions.map((quiz) => ({
          label: quiz.content,
          value: quiz.id,
        }));

        setQuestionOptionsList(questions);
      }
    } catch (error) {
      console.log("Error at trying to list quizzes: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [quizQuestionsRepository, selectedQuiz, setIsLoading]);

  useEffect(() => {
    setQuizzesQuestionsOptions();
  }, [setQuizzesQuestionsOptions]);

  useEffect(() => {
    setQuizzesOptions();
  }, [setQuizzesOptions]);

  const setQuizSelectQuizOption = useCallback(async () => {
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
        setValue("question_id", selectedQuiz.value, { shouldValidate: true });
        setSelectQuizInput({
          value: selectedQuiz.value,
          label: selectedQuiz.label,
        });
      }
    }
  }, [quizIdQueryParam, quizzesOptionsList, quizzesRepository, setValue]);

  useEffect(() => {
    setQuizSelectQuizOption();
  }, [setQuizSelectQuizOption]);

  const setQuizSelectQuizQuestionOption = useCallback(async () => {
    if (quizQuestionIdQueryParam) {
      const selectedQuizQuestion = questionOptionsList.find(
        (question) => question.value === quizQuestionIdQueryParam
      );
      if (selectedQuizQuestion) {
        const quizQuestionDetails =
          await quizQuestionsRepository.getQuizQuestionById(
            selectedQuizQuestion.value
          );
        if (quizQuestionDetails) {
          setSelectedQuizQuestion(quizQuestionDetails);
        }
        setValue("question_id", selectedQuizQuestion.value, {
          shouldValidate: true,
        });
        setSelectQuizQuestionInput({
          value: selectedQuizQuestion.value,
          label: selectedQuizQuestion.label,
        });
      }
    }
  }, [
    quizQuestionIdQueryParam,
    questionOptionsList,
    quizQuestionsRepository,
    setValue,
  ]);

  useEffect(() => {
    setQuizSelectQuizQuestionOption();
  }, [setQuizSelectQuizQuestionOption]);

  const getQuestionOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      if (selectedQuizQuestion) {
        const questionOptions =
          await questionOptionsRepository.listQuestionOptionByQuizQuestion(
            selectedQuizQuestion.id
          );
        setQuestionOptions(questionOptions);
        setShowRegisteredOptions(true);
        return questionOptions;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [questionOptionsRepository, selectedQuizQuestion, setIsLoading]);

  useEffect(() => {
    getQuestionOptions();
  }, [getQuestionOptions]);

  const { data: questionOptionsData, refetch: refetchQuestionOptions } =
    useQuery({
      queryKey: ["question-options", questionOptions],
      queryFn: getQuestionOptions,
    });

  const handleRegisterQuestionOption: SubmitHandler<RegisterQuestionOptionInputs> =
    useCallback(async () => {
      try {
        setIsLoading(true);
        if (selectedQuizQuestion && contentValue) {
          const { id } = selectedQuizQuestion;
          await questionsOptionsRepository.createQuestionOption({
            question_id: id,
            content: contentValue,
            is_correct: correctOptionSwitch,
          } as ICreateQuestionOptionDTO);
          await refetchQuestionOptions();
          showAlertSuccess("Opção de resposta cadastrada com sucesso!");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, [
      contentValue,
      correctOptionSwitch,
      questionsOptionsRepository,
      refetchQuestionOptions,
      selectedQuizQuestion,
      setIsLoading,
    ]);

  const handleToggleDeleteModal = (questionOption: IQuestionOptionDTO) => {
    setSelectedQuestionOption(questionOption);
    setDeleteModal(!deleteModal);
  };

  const handleToggleIsCorrectOptionSwitch = () => {
    setCorrectOptionSwitch(!correctOptionSwitch);
  };

  const handleDeleteQuestionOption = useCallback(
    async (questionOptionId: string) => {
      try {
        setIsLoading(true);
        await questionOptionsRepository.deleteQuestionOption(questionOptionId);
        await refetchQuestionOptions();
        showAlertSuccess("Opção removida com sucesso!");
        setDeleteModal(false);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [questionOptionsRepository, refetchQuestionOptions, setIsLoading]
  );

  const alreadyHasACorrectOption = useMemo(() => {
    const hasCorrectOption = questionOptions.some(
      (question) => question.is_correct
    );
    hasCorrectOption && setCorrectOptionSwitch(false);
    return hasCorrectOption;
  }, [questionOptions]);

  const handleFinishQuizzesCreation = () => {
    setSelectedQuiz(null);
    setSelectedQuizQuestion(null);
    setSelectedQuestionOption(null);
    setSelectQuizInput(null);
    setSelectQuizQuestionInput(null);
    setQuestionOptions([]);
    setCorrectOptionSwitch(false);
    setShowRegisteredOptions(false);
    setValue("content", "");
    navigate(
      `/dashboard/gerenciar-perguntas-e-respostas?quizId=${selectQuizInput?.value}`
    );
  };

  const hasCorrectOption = useMemo(() => {
    const hasCorrectOption = questionOptions.some(
      (question) => question.is_correct
    )
    return hasCorrectOption
  },[questionOptions])

  return (
    <main className="flex flex-col bg-gray-100 dark:bg-slate-800 w-full h-full pl-[80px] mt-2">
      <div className="flex flex-col w-full">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar opção de resposta"
            iconName="edit"
          />
        </div>
        <div className="w-full flex flex-col xl:flex-row justify-center mt-4">
          <RegistrationInfo
            iconName="edit"
            infoText="Cadastre uma opção de resposta vinculada à uma pergunta. Somente uma opção de resposta pode ser considerada válida para cada pergunta."
            registration="Opção de resposta"
          />
          <div className="flex flex-col items-center w-[90%] xl:w-[40vw] mr-6 xl:ml-4 bg-white dark:bg-slate-700 p-8 rounded-md">
            <form
              className="w-full"
              onSubmit={handleSubmit(handleRegisterQuestionOption)}
            >
              <div className="w-full flex flex-col md:flex-row mb-6">
                <div className="w-full">
                  <SelectInput
                    label="Selecione um questionário"
                    options={quizzesOptionsList}
                    onSelectOption={handleQuizSelect as never}
                    placeholder={
                      selectQuizInput && selectQuizInput.label
                        ? selectQuizInput?.label
                        : "Selecione um questionário"
                    }
                    defaultValue={selectQuizInput?.label}
                    isDisabled={
                      quizIdQueryParam && quizIdQueryParam?.length > 0
                        ? true
                        : false
                    }
                  />
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row mb-6">
                <div className="w-full">
                  <SelectInput
                    label="Selecione uma pergunta"
                    options={questionOptionsList}
                    onSelectOption={handleQuizQuestionSelect as never}
                    placeholder={
                      selectQuizQuestionInput && selectQuizQuestionInput.label
                        ? selectQuizQuestionInput?.label
                        : "Selecione uma pergunta"
                    }
                    defaultValue={selectQuizQuestionInput?.label}
                    isDisabled={
                      quizQuestionIdQueryParam &&
                      quizQuestionIdQueryParam?.length > 0
                        ? true
                        : false
                    }
                  />
                </div>
              </div>

              <div className="w-full mt-2 h-[100px] mb-[56px]">
                <TextAreaInput
                  label="Conteúdo da resposta"
                  placeholder="Conteúdo da resposta. Máximo de 120 caracters"
                  showTextLength
                  maxTextLength={MAX_OPTION_CONTENT_LENGTH}
                  currentTextLength={contentValue ? contentValue.length : 0}
                  {...register("content")}
                />
                {errors && errors.content && (
                  <ErrorMessage errorMessage={errors.content?.message} />
                )}
              </div>
              <div className="mt-2 mb-4 flex flex-col">
                <span className="text-gray-700 dark:text-gray-100 text-[13px] mb-1">
                  Resposta correta
                </span>
                <Switcher
                  checked={correctOptionSwitch}
                  onChange={handleToggleIsCorrectOptionSwitch}
                  disabled={alreadyHasACorrectOption}
                />
              </div>

              <div className="w-full mt-2 mb-5">
                <Button
                  title="Cadastrar resposta"
                  type="submit"
                  isLoading={isLoading}
                  disabled={
                    isLoading ||
                    !isValid ||
                    questionOptions.length >= MAX_QUESTION_OPTIONS
                  }
                  className="bg-primary-dark w-full h-[52px] flex items-center justify-center normal-case 
              lg:text-base text-sm font-medium font-poppins rounded-lg disabled:opacity-[0.5] 
              text-gray-50 font-secondary"
                />
              </div>
              {questionOptionsData && showRegisteredOptions && (
                <div className="w-full">
                  <span className="text-gray-700 dark:text-gray-100 text-[12px] md:text-[14px] font-bold mb-2">
                    Respostas cadastradas:
                  </span>
                  <QuestionOptionsList
                    questions={questionOptionsData}
                    onDeleteOption={handleToggleDeleteModal}
                  />
                </div>
              )}
            </form>
            <div className="w-full mt-2 mb-5">
              <Button
                title="Finalizar criação de questionários"
                type="button"
                disabled={questionOptions.length < MIN_QUESTION_OPTIONS || !hasCorrectOption}
                onClick={handleFinishQuizzesCreation}
                className="bg-primary w-full h-[52px] flex items-center justify-center normal-case 
              lg:text-base text-sm font-medium font-poppins rounded-lg disabled:opacity-[0.5] 
              text-gray-50 font-secondary"
              />
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={deleteModal}
        onClose={handleToggleDeleteModal as never}
        onRequestClose={handleToggleDeleteModal as never}
        onConfirmAction={() =>
          handleDeleteQuestionOption(selectedQuestionOption!.id)
        }
        resource="pergunta"
      />
    </main>
  );
}
