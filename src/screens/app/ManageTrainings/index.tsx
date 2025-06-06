import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import video_thumbnail_placeholder from "@/assets/video_thumbnail_placeholder.svg";
import { PlusButton } from "@/components/buttons/PlusButton";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { IUpdateTrainingDTO } from "@/repositories/interfaces/trainingsRepository";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteModal } from "../../../components/miscellaneous/DeleteModal";
import { EditTrainingModal } from "./components/EditTrainingModal";
import { TrainingInfoCard } from "./components/TrainingInfoCard";

export default function ManageTrainings() {
  const [trainings, setTrainings] = useState<ITrainingDTO[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalTrainingOpen] = useState(false);
  const [isEditModalTrainingOpen, setIsEditModalTrainingOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<ITrainingDTO | null>(
    null
  );

  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();
  const queryClient = useQueryClient();

  const { setIsLoading } = useLoading();

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepositories();
  }, []);

  const handleSeeTraining = (trainingId: string) => {
    navigate(`/dashboard/gerenciar-videoaulas?trainingId=${trainingId}`);
  };

  const handleRegisterTraining = () => {
    navigate("/dashboard/cadastrar-treinamento");
  };

  const getTrainings = useCallback(async () => {
    try {
      const trainings = await trainingsRepository.listTrainings(user.companyId);
      setTrainings(trainings);
      return trainings;
    } catch (error) {
      console.log(error);
    }
  }, [trainingsRepository, user.companyId]);

  const { isLoading, error } = useQuery({
    queryKey: ["trainings"],
    queryFn: getTrainings,
  });

  const handleDeleteTraining = useCallback(
    async (trainingId: string) => {
      try {
        setIsLoading(true);
        await trainingsRepository.deleteTraining(trainingId);
        showAlertSuccess("Treinamento deletado com sucesso!");
        setIsDeleteModalTrainingOpen(false);
        queryClient.invalidateQueries(["trainings"] as InvalidateQueryFilters);
      } catch (error) {
        showAlertError(
          "Houve um erro ao deletar treinamento. Por favor, tente novamente mais tarde."
        );
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, setIsLoading, trainingsRepository]
  );

  const handleToggleEditModalTraining = useCallback(
    (training?: ITrainingDTO) => {
      setIsEditModalTrainingOpen(!isEditModalTrainingOpen);
      if (training) {
        setSelectedTraining(training);
      }
    },
    [isEditModalTrainingOpen]
  );

  const handleToggleDeleteModal = (training?: ITrainingDTO) => {
    setIsDeleteModalTrainingOpen(!isDeleteModalOpen);
    if (training) {
      setSelectedTraining(training);
    }
  };

  const handleUpdateUser = useCallback(
    async (data: IUpdateTrainingDTO) => {
      try {
        setIsLoading(true);
        await trainingsRepository.updateTraining({
          ...data,
          id: selectedTraining!.id,
        });
        handleToggleEditModalTraining();
        showAlertSuccess("Treinamento atualizado com sucesso!");
        queryClient.invalidateQueries(["trainings"] as InvalidateQueryFilters);
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          if (error.STATUS === 409) {
            showAlertError("Já existe um treinamento com o nome informado.");
          } else {
            showAlertError("Houve um erro ao tentar atualizar treinamento.");
          }
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      handleToggleEditModalTraining,
      queryClient,
      selectedTraining,
      setIsLoading,
      trainingsRepository,
    ]
  );

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-4 ml-4">
            <ScreenTitleIcon screenTitle="Treinamentos" iconName="book-open" />
            <Subtitle
              content="Consulte, veja videoaulas relacionadas e gerencie seus treinamentos."
              className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
            />
          </div>
          <div className="mr-4">
            <PlusButton
              title="Cadastrar novo treinamento"
              onClick={handleRegisterTraining}
            />
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
          <>
            {trainings.length > 0 ? (
              <div className="lg:w-full flex-row flex-wrap flex items-start px-4 mt-2 justify-center lg:justify-start">
                {trainings.map((training) => (
                  <TrainingInfoCard
                    key={training.id}
                    training={training.name}
                    description={training.description}
                    isAvailable={
                      training.video_classes &&
                      training.video_classes?.length > 0 &&
                      training.quizes &&
                      training.quizes.some(
                        (quiz) =>
                          quiz.questions &&
                          quiz.questions.some(
                            (question) =>
                              question.options &&
                              question.options?.length > 0 &&
                              question.options.some(
                                (option) => option.is_correct
                              )
                          )
                      )
                        ? true
                        : false
                    }
                    cover_url={
                      training.cover_url
                        ? training.cover_url
                        : video_thumbnail_placeholder
                    }
                    onEdit={() => handleToggleEditModalTraining(training)}
                    onDelete={() => handleToggleDeleteModal(training)}
                    onSeeTraining={() => handleSeeTraining(training.id)}
                    showsSeeClassesButton={
                      training &&
                      training.video_classes &&
                      training.video_classes.length > 0
                        ? true
                        : false
                    }
                    selectedTrainingId={
                      selectedTraining && (selectedTraining.id as string)
                    }
                  />
                ))}
              </div>
            ) : (
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200 ml-[18px]">
                Até o momento, nenhum treinamento foi registrado.
              </span>
            )}
          </>
        )}
      </div>
      <DeleteModal
        resource="treinamento"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal as never}
        onConfirmAction={() => handleDeleteTraining(selectedTraining!.id)}
      />
      <EditTrainingModal
        isOpen={isEditModalTrainingOpen}
        onClose={handleToggleEditModalTraining}
        onRequestClose={handleToggleEditModalTraining as never}
        onConfirmAction={handleUpdateUser}
        isLoading={isLoading}
        selectedTrainingId={selectedTraining && selectedTraining.id}
      />
    </main>
  );
}
