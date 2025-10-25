import {
  ICompleteQuizQuestionDTO,
  IQuizQuestionDTO,
} from "@/repositories/dtos/QuestionDTO";
import { Chip } from "@material-tailwind/react";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface QuizQuestionCardProps {
  questions: ICompleteQuizQuestionDTO[];
  onEditQuestion: (quiz: IQuizQuestionDTO) => void;
  onDeleteQuestion: (quiz: IQuizQuestionDTO) => void;
}

export function QuizQuestionCard({
  questions,
  onEditQuestion,
  onDeleteQuestion,
}: QuizQuestionCardProps) {
  const navigate = useNavigate();

  const onSeeQuestionOptions = (quizQuestionId: string, quizId: string) =>
    navigate(
      `/dashboard/cadastrar-resposta?quizId=${quizId}&quizQuestionId=${quizQuestionId}`
    );

  return (
    <>
      {questions.map((question) => (
        <div className="w-full flex flex-col shadow-sm bg-white dark:bg-slate-700 rounded-md p-4 mb-2" key={question.id}>
          <div className="w-full flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-row flex-1 mr-3 mb-1">
              <span className="text-gray-800 dark:text-gray-50 text-[11px] md:text-[14px] font-bold font-secondary mb-1 mr-3">
                Treinamento:
              </span>
              <span className="text-gray-800 dark:text-gray-50 text-[11px] md:text-[14px] font-secondary mb-1 mr-3">
                {question.quiz.training.name}
              </span>
            </div>
            <div className="flex flex-row">
              <button
                onClick={() => onEditQuestion(question)}
                className="text-gray-800 dark:text-gray-50 border-gray-800 dark:border-gray-50  text-[11px] md:text-[13px] font-secondary mb-1 mr-3 py-1 px-1 md:px-3 rounded-md border-2"
              >
                Editar pergunta
              </button>
              <button
                onClick={() =>
                  onSeeQuestionOptions(question.id, question.quiz.id)
                }
                className="text-gray-800 dark:text-gray-50 border-gray-800 dark:border-gray-50  text-[11px] md:text-[13px] font-secondary mb-1 mr-3 py-1 px-3 rounded-md border-2"
              >
                Editar respostas
              </button>
              <button onClick={() => onDeleteQuestion(question)}>
                <MdDelete className="w-4 h-4 lg:w-5 lg:h-5 text-red-400 ml-3" />
              </button>
            </div>
          </div>
          <div className="w-full flex flex-row md:items-start mt-4 md:mt-1  mx-auto">
            <span className="text-gray-800 dark:text-gray-50 text-[11px] md:text-[14px] font-bold font-secondary mb-1 mr-3">
              Pergunta:
            </span>
            <span className="text-gray-800 dark:text-gray-50 text-[11px] md:text-[14px] font-secondary mb-1 mr-3">
              {question.content}
            </span>
          </div>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] md:text-[14px] font-bold font-secondary mt-4 mb-1 mr-3">
            Opções:
          </span>
          {question.options.map((option) => (
            <div
              className="w-full flex flex-row items-center mb-2 ml-4"
              key={option.id}
            >
              <li className="text-[11px] md:text-[12px] text-gray-800 dark:text-gray-200  list-disc">
                {option.content}
              </li>
              <div className="flex items-center">
                {option.is_correct && (
                  <Chip
                    value="Opção correta"
                    size="sm"
                    className="ml-2 bg-green-500 text-[10px] md:text-[11px] p-1"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
