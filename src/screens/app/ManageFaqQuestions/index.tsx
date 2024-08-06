import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { faqQuestions } from "@/data/mocked";
import { useState } from "react";
import { EditFaqQuestionModal } from "./components/EditFaqQuestionModal";
import { FaqCollapsibleCard } from "./components/FaqCollapsibleCard";

export function ManageFaqQuestions() {
  const [isDeleteModalOpen, setIsDeleteModalUserOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditModalUserOpen] = useState(false);

  const handleToggleEditUserModal = () => {
    setIsEditModalUserOpen(!isEditUserModalOpen);
  };
  const handleToggleDeleteModal = () => {
    setIsDeleteModalUserOpen(!isDeleteModalOpen);
  };

  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon
        screenTitle="Perguntas frequentes"
        iconName="help-circle"
      />
      <Subtitle
        content="Veja a baixo as dúvidas mais comuns. Por favor, certifique-se de que sua dúvida não esteja esclarecida antes de acessar o suporte."
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
      />
      <FaqCollapsibleCard
        questions={faqQuestions}
        onDeleteQuestion={handleToggleDeleteModal}
        onEditQuestion={handleToggleEditUserModal}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal}
        onConfirmAction={() => console.log("Question deleted")}
        resource="pergunta"
      />
      <EditFaqQuestionModal
        isOpen={isEditUserModalOpen}
        onClose={handleToggleEditUserModal}
        onRequestClose={handleToggleEditUserModal}
      />
    </div>
  );
}
