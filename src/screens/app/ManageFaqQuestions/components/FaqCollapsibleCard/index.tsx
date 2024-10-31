import { useState } from "react";
import { Collapse } from "react-collapse";
import { FiChevronDown, FiChevronLeft } from "react-icons/fi";
import { MdDelete, MdEdit } from "react-icons/md";

interface IQuestion {
  id: string;
  question: string;
  answer: string;
}

interface FaqCollapsibleCardProps {
  questions: IQuestion[];
  onDeleteQuestion: (questionId: string) => void;
  onEditQuestion: (questionId: string) => void;
  onSelectQuestion: (questionId: string) => void;
}

export function FaqCollapsibleCard({
  questions,
  onDeleteQuestion,
  onEditQuestion,
  onSelectQuestion,
}: FaqCollapsibleCardProps) {
  const [openedQuestions, setOpenedQuestions] = useState<number[]>([]);

  const toggleQuestion = (questionIndex: number) => {
    if (openedQuestions.includes(questionIndex)) {
      setOpenedQuestions(
        openedQuestions.filter((index) => index !== questionIndex)
      );
    } else {
      setOpenedQuestions([...openedQuestions, questionIndex]);
    }
  };

  const handleDeleteFaqQuestion = (faqQuestionId: string) => {
    onSelectQuestion(faqQuestionId);
    onDeleteQuestion(faqQuestionId);
  };

  const handleEditFaqQuestion = (faqQuestionId: string) => {
    onSelectQuestion(faqQuestionId);
    onEditQuestion(faqQuestionId);
  };

  return (
    <div className="w-full md:w-[90%] overflow-y-auto flex flex-col bg-white p-4 dark:bg-slate-700 rounded-md shadow-md">
      {questions.map((question, i) => (
        <div key={question.question + i} className="mb-4">
          <div className="mb-4">
            <div className="w-full flex flex-row justify-between items-center mb-2">
              <div className="w-full flex flex-row justify-between">
                <button onClick={() => toggleQuestion(i)}>
                  <h3 className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold mr-3 text-left">
                    {question.question}
                  </h3>
                </button>
              </div>
              {!openedQuestions.includes(i) ? (
                <button onClick={() => toggleQuestion(i)}>
                  <FiChevronDown
                    size={16}
                    className="text-gray-800 dark:text-gray-50 "
                  />
                </button>
              ) : (
                <button onClick={() => toggleQuestion(i)}>
                  <FiChevronLeft
                    size={16}
                    className="text-gray-800 dark:text-gray-50 "
                  />
                </button>
              )}
              <div className="flex flex-row ml-7">
                <button onClick={() => handleEditFaqQuestion(question.id)}>
                  <MdEdit
                    size={16}
                    className="text-gray-800 dark:text-gray-50 mr-1"
                  />
                </button>
                <button onClick={() => handleDeleteFaqQuestion(question.id)}>
                  <MdDelete size={16} className="text-red-400 ml-2" />
                </button>
              </div>
            </div>
          </div>
          <Collapse isOpened={openedQuestions.includes(i)}>
            <div className="w-full flex flex-col">
              <p className="text-gray-800 dark:text-gray-300 text-[12px] md:text-[13px] font-primary text-pretty mt-[-16px] mb-4">
                {question.answer}
              </p>
            </div>
          </Collapse>
          {i !== questions.length - 1 && (
            <div className="w-full h-[1px] bg-gray-200 dark:bg-slate-600 mb-4" />
          )}
        </div>
      ))}
    </div>
  );
}
