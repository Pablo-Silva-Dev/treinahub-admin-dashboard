import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface QuizInfoCardProps {
  training: string;
  totalQuestions?: number;
  onDelete: () => void;
}

export function QuizInfoCard({
  training,
  totalQuestions,
  onDelete,
}: QuizInfoCardProps) {
  const navigate = useNavigate();

  const onSeeQuestions = () =>
    navigate("/dashboard/gerenciar-perguntas-e-respotas");

  return (
    <div className="w-full flex flex-row items-center justify-between shadow-sm bg-white dark:bg-slate-700 rounded-md p-4 mb-2">
      <div className="flex flex-row items-center">
        <span className="text-gray-800 dark:text-gray-50 text-[11px] md:text-[14px] font-bold font-secondary mb-1 mr-3">
          Questionário do {training}
        </span>
        {totalQuestions && totalQuestions > 0 ? (
          <button
            className="text-gray-800 dark:text-gray-50 text-[10px] md:text-[12px] font-secondary"
            onClick={onSeeQuestions}
          >
            {totalQuestions}{" "}
            {totalQuestions > 1
              ? "perguntas cadastradas"
              : "pergunta cadastrada"}
          </button>
        ) : (
          <span className="text-gray-800 dark:text-gray-50 text-[10px] md:text-[12px] font-secondary">
            Nenhuma pergunta cadastrada
          </span>
        )}
      </div>
      <button onClick={onDelete}>
        <MdDelete className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 ml-3" />
      </button>
    </div>
  );
}
