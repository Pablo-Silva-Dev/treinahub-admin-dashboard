import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { PlusButton } from "@/components/buttons/PlusButton";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { useThemeStore } from "@/store/theme";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteModal } from "../../../components/miscellaneous/DeleteModal";
import { EditTrainingModal } from "./components/EditTrainingModal";
import { TrainingInfoCard } from "./components/TrainingInfoCard";

export function ManageTrainings() {
  const [trainings, setTrainings] = useState<ITrainingDTO[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalUserOpen] = useState(false);
  const [isEditTrainingModalOpen, setIsEditModalUserOpen] = useState(false);

  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const trainingsRepository = new TrainingsRepositories();

  const handleSeeTraining = () => {
    //TODO-PABLO: update navigation to navigate to specific training videoclasses
    navigate("/dashboard/gerenciar-videoaulas");
  };

  const getTrainings = useCallback(async () => {
    try {
      const trainings = await trainingsRepository.listTrainings();
      setTrainings(trainings);
      return trainings;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const { isLoading, error } = useQuery({
    queryKey: ["trainings"],
    queryFn: getTrainings,
  });

  const handleToggleEditTrainingModal = () => {
    setIsEditModalUserOpen(!isEditTrainingModalOpen);
  };
  const handleToggleDeleteModal = () => {
    setIsDeleteModalUserOpen(!isDeleteModalOpen);
  };
  return (
    <main className="flex flex-1 flex-col w-[90%] lg:w-full mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-3 ml-4">
            <ScreenTitleIcon screenTitle="Treinamentos" iconName="book-open" />
          </div>
          <div className="mr-4">
            <Link to="/dashboard/cadastrar-treinamento">
              <PlusButton title="Cadastrar novo treinamento" />
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
          <div className="lg:w-full flex-row flex-wrap flex items-start px-4 mt-4 justify-center lg:justify-start">
            {trainings.map((training) => (
              <TrainingInfoCard
                key={training.id}
                training={training.name}
                description={training.description}
                cover_url={training.cover_url!}
                onEdit={handleToggleEditTrainingModal}
                onDelete={handleToggleDeleteModal}
                onSeeTraining={handleSeeTraining}
              />
            ))}
          </div>
        )}
      </div>
      <DeleteModal
        resource="treinamento"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal}
        onConfirmAction={() => console.log("Training deleted")}
      />
      <EditTrainingModal
        isOpen={isEditTrainingModalOpen}
        onClose={handleToggleEditTrainingModal}
        onRequestClose={handleToggleEditTrainingModal}
        onConfirmAction={() => console.log("Training edited")}
      />
    </main>
  );
}
