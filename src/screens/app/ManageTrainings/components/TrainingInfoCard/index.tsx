import { MdDelete, MdEdit } from "react-icons/md";

interface TrainingInfoCardProps {
  training: string;
  description: string;
  cover_url: string;
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
        className="w-full max-h-[240px] aspect-auto"
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
      </div>
    </div>
  );
}
