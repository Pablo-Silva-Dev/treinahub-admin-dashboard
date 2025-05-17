import { IconButton, Tooltip } from "@material-tailwind/react";
import { MdDelete, MdEdit, MdInfo } from "react-icons/md";

interface TrainingInfoCardProps {
  training: string;
  description: string;
  cover_url: string;
  isAvailable: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSeeTraining: (trainingId: string) => void;
  showsSeeClassesButton: boolean;
  selectedTrainingId: string | null;
}

export function TrainingInfoCard({
  cover_url,
  training,
  description,
  isAvailable,
  onDelete,
  onEdit,
  onSeeTraining,
  showsSeeClassesButton,
  selectedTrainingId,
}: TrainingInfoCardProps) {
  return (
    <div className="w-full sm:w-[320px] lg:w-[400px] flex flex-col shadow-sm bg-white dark:bg-slate-700 rounded-md mr-0 md:mr-8 mb-5">
      <img
        src={cover_url}
        alt="info_card_placeholder"
        className="w-full h-[140px] object-cover rounded-t-md"
      />
      <div className="w-full p-4 flex flex-col ">
        <span className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold font-secondary mb-1">
          {training}
        </span>
        <div className="w-full h-[80px] overflow-y-auto overflow-x-hidden">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {description}
          </span>
        </div>
        <div className="w-full h-[1px] bg-gray-200 dark:bg-slate-600 mt-2 mb-4" />
        <div className="flex flex-row justify-between items-center">
          {showsSeeClassesButton && (
            <button
              className="border-[1px] border-gray-400 dark:border-gray-50 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 p-2 rounded-md"
              onClick={() => onSeeTraining(selectedTrainingId!)}
            >
              Ver videoaulas
            </button>
          )}
          <div className="flex flex-row items-center">
            <button onClick={onEdit}>
              <MdEdit className="w-4 h-4 lg:w-5 lg:h-5 text-gray-700 dark:text-gray-50" />
            </button>
            <button onClick={onDelete}>
              <MdDelete className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 ml-3" />
            </button>
          </div>
        </div>
        {isAvailable ? (
          <span className="text-green-500 text-xs lg:text-sm py-1 rounded-full w-auto mt-3">
            Disponível para os usuários.
          </span>
        ) : (
          <span className="text-amber-500 text-xs lg:text-sm py-1 rounded-full w-auto mt-3">
            Videoaulas ou questionários pendentes.
            <Tooltip
              className="hidden lg:flex max-w-[400px]"
              content="Verifique se há videoaulas ou questionários pendentes. Cada pergunta do questionário deve ter pelo menos 2 alternativas sendo uma a correta."
            >
              <IconButton
                variant="text"
                className="p-0 bg-transparent hover:bg-transparent hover:p-0 mr-8 lg:mr-4"
              >
                <MdInfo className="lg:h-5 lg:w-5 h-4 w-4 p-0 text-gray-700 dark:text-gray-300 rounded-full" />
              </IconButton>
            </Tooltip>
          </span>
        )}
      </div>
    </div>
  );
}
