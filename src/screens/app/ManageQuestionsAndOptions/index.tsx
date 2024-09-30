import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { PlusButton } from "@/components/buttons/PlusButton";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import {
  ICompleteQuizQuestionDTO,
  IQuizQuestionDTO,
  IUpdateQuizQuestionDTO,
} from "@/repositories/dtos/QuestionDTO";
import { QuizQuestionsRepository } from "@/repositories/quizQuestionsRepository";
import { QuizzesRepository } from "@/repositories/quizzesRepository";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DeleteModal } from "../../../components/miscellaneous/DeleteModal";
import { EditQuizQuestionModal } from "./components/EditQuizQuestionModal";
import { QuizQuestionCard } from "./components/QuizQuestionCard";

export function ManageQuestionsAndOptions() {
  const [quizzes, setQuizzes] = useState<ICompleteQuizQuestionDTO[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalQuizOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalQuizOpen] = useState(false);
  const [selectedQuizQuestion, setSelectedQuizQuestion] =
    useState<IQuizQuestionDTO | null>(null);

  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const { setIsLoading } = useLoading();

  const quizzesRepository = useMemo(() => {
    return new QuizzesRepository();
  }, []);

  const quizQuestionsRepository = useMemo(() => {
    return new QuizQuestionsRepository();
  }, []);

  const getQuizzes = useCallback(async () => {
    try {
      const quizzes = await quizzesRepository.listQuizzes();
      const quizzesQuestions = quizzes.map((q) => q.questions).flat();
      if (quizzesQuestions) {
        setQuizzes(quizzesQuestions as ICompleteQuizQuestionDTO[]);
        return quizzes;
      }
    } catch (error) {
      console.log(error);
    }
  }, [quizzesRepository]);

  const { isLoading, error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  const handleToggleDeleteModal = (quiz: IQuizQuestionDTO) => {
    setIsDeleteModalQuizOpen(!isDeleteModalOpen);
    setSelectedQuizQuestion(quiz);
  };

  const handleToggleUpdateModal = (quiz: IQuizQuestionDTO) => {
    setIsUpdateModalQuizOpen(!isUpdateModalOpen);
    setSelectedQuizQuestion(quiz);
  };

  const handleDeleteQuiz = useCallback(
    async (questionId: string) => {
      try {
        setIsLoading(true);
        await quizQuestionsRepository.deleteQuizQuestion(questionId);
        showAlertSuccess("Pergunta deletada com sucesso!");
        setIsDeleteModalQuizOpen(false);
        queryClient.invalidateQueries(["quizzes"] as InvalidateQueryFilters);
      } catch (error) {
        showAlertError(
          "Houve um erro ao tentar deletar pergunta. Por favor, tente novamente mais tarde."
        );
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, quizQuestionsRepository, setIsLoading]
  );

  const handleUpdateQuizQuestion = useCallback(
    async (data: IUpdateQuizQuestionDTO) => {
      try {
        if (data.id) {
          setIsLoading(true);
          await quizQuestionsRepository.updateQuizQuestion(data);
          showAlertSuccess("Pergunta atualizada com sucesso!");
          queryClient.invalidateQueries(["quizzes"] as InvalidateQueryFilters);
          return;
        }
      } catch (error) {
        showAlertError(
          "Houve um erro ao tentar atualizar pergunta. Por favor, tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, quizQuestionsRepository, setIsLoading]
  );

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-4 ml-4">
            <ScreenTitleIcon
              screenTitle="Perguntas e respostas"
              iconName="edit"
            />
            <Subtitle
              content="Consulte e gerencie perguntas e respotas relacionadas aos seus questionários."
              className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
            />
          </div>
          <div className="mr-4">
            <Link to="/dashboard/cadastrar-pergunta">
              <PlusButton title="Cadastrar nova pergunta" />
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="w-full mt-[10vh]">
            <Loading color={PRIMARY_COLOR} />
          </div>
        ) : error ? (
          <div className="w-full mt-[10vh] flex flex-col items-center justify-center">
            <img
              src={theme === "light" ? error_warning : error_warning_dark}
              alt="page_not_found"
              width={200}
              height={120}
            />
          </div>
        ) : (
          <div
            className="w-full px-4 mt-2 flex flex-col max-h-[560px] overflow-y-auto"
            style={{ height: 560 }}
          >
            <QuizQuestionCard
              questions={quizzes}
              onEditQuestion={(quiz: IQuizQuestionDTO) =>
                handleToggleUpdateModal(quiz)
              }
              onDeleteQuestion={(quiz: IQuizQuestionDTO) =>
                handleToggleDeleteModal(quiz)
              }
            />
          </div>
        )}
      </div>
      <DeleteModal
        resource="pergunta"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal as never}
        onRequestClose={handleToggleDeleteModal as never}
        onConfirmAction={() => handleDeleteQuiz(selectedQuizQuestion!.id)}
      />
      <EditQuizQuestionModal
        isLoading={isLoading}
        isOpen={isUpdateModalOpen}
        onClose={handleToggleUpdateModal as never}
        onRequestClose={handleToggleUpdateModal as never}
        onConfirmAction={handleUpdateQuizQuestion}
        selectedQuizQuestionId={selectedQuizQuestion && selectedQuizQuestion.id}
      />
    </main>
  );
}
