import { PlusButton } from "@/components/buttons/PlusButton";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { trainings } from "@/data/mocked";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DeleteModal } from "../../../components/miscellaneous/DeleteModal";
import { EditTrainingModal } from "./components/EditTrainingModal";
import { TrainingInfoCard } from "./components/TrainingInfoCard";

export function ManageTrainings() {
  const [isDeleteModalOpen, setIsDeleteModalUserOpen] = useState(false);
  const [isEditTrainingModalOpen, setIsEditModalUserOpen] = useState(false);

  const navigate = useNavigate();

  const handleToggleEditTrainingModal = () => {
    setIsEditModalUserOpen(!isEditTrainingModalOpen);
  };
  const handleToggleDeleteModal = () => {
    setIsDeleteModalUserOpen(!isDeleteModalOpen);
  };

  const handleSeeTraining = () => {
    //TODO-PABLO: update navigation to navigate to specific training videoclasses
    navigate("/dashboard/gerenciar-videoaulas");
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
        <div className="lg:w-full flex-row flex-wrap flex items-start px-4 mt-4 justify-center lg:justify-start">
          {trainings.map((training) => (
            <TrainingInfoCard
              training={training.training}
              description={training.description}
              cover_url={training.cover_url}
              onEdit={handleToggleEditTrainingModal}
              onDelete={handleToggleDeleteModal}
              onSeeTraining={handleSeeTraining}
            />
          ))}
        </div>
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
