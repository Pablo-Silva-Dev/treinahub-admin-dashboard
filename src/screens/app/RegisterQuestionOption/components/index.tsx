import { IQuestionOptionDTO } from "@/repositories/dtos/QuestionOptionDTO";
import { Chip } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
interface QuestionOptionsListProps {
  questions: IQuestionOptionDTO[];
  onDeleteOption: (questionOption: IQuestionOptionDTO) => void;
}

export function QuestionOptionsList({
  questions,
  onDeleteOption,
}: QuestionOptionsListProps) {
  return (
    <div className="w-full max-h-[240px] overflow-y-auto mt-1">
      {questions.map((question) => (
        <div
          className="w-full flex flex-row items-center justify-between mb-2 p-2"
          key={question.id}
        >
          <li className="text-[11px] md:text-[12px] text-gray-800 dark:text-gray-200  list-disc">
            {question.content}
          </li>
          <div className="flex items-center">
            {question.is_correct && (
              <Chip
                value="Opção correta"
                size="sm"
                className="mr-2 bg-green-500 text-[10px] md:text-[11px]"
              />
            )}
            <button type="button" onClick={() => onDeleteOption(question)}>
              <MdDelete size={16} className="text-red-400 ml-2" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
