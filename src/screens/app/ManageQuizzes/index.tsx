import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { PlusButton } from "@/components/buttons/PlusButton";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { IQuizDTO } from "@/repositories/dtos/QuizDTO";
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
import { QuizInfoCard } from "./components/QuizCard";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<IQuizDTO[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalQuizOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<IQuizDTO | null>(null);

  const { theme } = useThemeStore();
  const queryClient = useQueryClient();

  const { setIsLoading } = useLoading();

  const quizzesRepository = useMemo(() => {
    return new QuizzesRepository();
  }, []);

  const getQuizzes = useCallback(async () => {
    try {
      const quizzes = await quizzesRepository.listQuizzes();
      setQuizzes(quizzes);
      return quizzes;
    } catch (error) {
      console.log(error);
    }
  }, [quizzesRepository]);

  const { isLoading, error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizzes,
  });

  const handleDeleteQuiz = useCallback(
    async (quizId: string) => {
      try {
        setIsLoading(true);
        await quizzesRepository.deleteQuiz(quizId);
        showAlertSuccess("Questionário deletado com sucesso!");
        setIsDeleteModalQuizOpen(false);
        queryClient.invalidateQueries(["quizzes"] as InvalidateQueryFilters);
      } catch (error) {
        showAlertError(
          "Houve um erro ao deletar questionário. Por favor, tente novamente mais tarde."
        );
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, quizzesRepository, setIsLoading]
  );

  const handleToggleDeleteModal = (quiz?: IQuizDTO) => {
    setIsDeleteModalQuizOpen(!isDeleteModalOpen);
    if (quiz) {
      setSelectedQuiz(quiz);
    }
  };

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-4 ml-4">
            <ScreenTitleIcon screenTitle="Questionários" iconName="edit" />
            <Subtitle
              content="Consulte e gerencie questionários relacionados aos seus treinamentos."
              className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
            />
          </div>
          <div className="mr-4">
            <Link to="/dashboard/cadastrar-questionario">
              <PlusButton title="Cadastrar novo questionário" />
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
            {quizzes.map((quiz) => (
              <QuizInfoCard
                key={quiz.id}
                training={quiz.training.name}
                onDelete={() => handleToggleDeleteModal(quiz)}
                totalQuestions={quiz.questions && quiz.questions.length}
              />
            ))}
          </div>
        )}
      </div>
      <DeleteModal
        resource="questionário"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal as never}
        onConfirmAction={() => handleDeleteQuiz(selectedQuiz!.id)}
      />
    </main>
  );
}
