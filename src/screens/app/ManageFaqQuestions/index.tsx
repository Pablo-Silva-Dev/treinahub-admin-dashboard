import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import {
  IFaqQuestionDTO,
  IUpdateFaqQuestionDTO,
} from "@/repositories/dtos/FaqQuestionDTO";
import { FaqQuestionsRepository } from "@/repositories/faqQuestionsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EditFaqQuestionModal } from "./components/EditFaqQuestionModal";
import { FaqCollapsibleCard } from "./components/FaqCollapsibleCard";

export function ManageFaqQuestions() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [faqQuestions, setFaqQuestions] = useState<IFaqQuestionDTO[]>([]);
  const [selectedFaqQuestion, setSelectedFaqQuestion] =
    useState<IFaqQuestionDTO | null>(null);

  const { isLoading: loading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();
  const queryClient = useQueryClient();

  const handleToggleEditFaqQuestionModal = useCallback(() => {
    setIsEditModalOpen(!isEditModalOpen);
  }, [isEditModalOpen]);

  const handleToggleDeleteFaqQuestionModal = useCallback(() => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  const faqQuestionsRepository = useMemo(() => {
    return new FaqQuestionsRepository();
  }, []);

  const getFaqQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const faqQuestions = await faqQuestionsRepository.listFaqQuestions(
        user.companyId
      );
      setFaqQuestions(faqQuestions);
      return faqQuestions;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [faqQuestionsRepository, setIsLoading, user.companyId]);

  useEffect(() => {
    getFaqQuestions();
  }, [getFaqQuestions]);

  const getFaqQuestion = useCallback(
    async (faqQuestionId: string) => {
      try {
        if (faqQuestionId) {
          const faqQuestion =
            await faqQuestionsRepository.getFaqQuestionById(faqQuestionId);
          setSelectedFaqQuestion(faqQuestion);
          return faqQuestion;
        }
      } catch (error) {
        console.log(error);
      }
    },
    [faqQuestionsRepository]
  );

  useEffect(() => {
    getFaqQuestions();
  }, [getFaqQuestions]);

  const handleDeleteContactSupport = useCallback(
    async (faqQuestionId: string) => {
      try {
        setIsLoading(true);
        if (faqQuestionId) {
          await faqQuestionsRepository.deleteFaqQuestion(faqQuestionId);
          handleToggleDeleteFaqQuestionModal();
          showAlertSuccess("Contato deletado com sucesso!");
          queryClient.invalidateQueries([
            "contacts-support",
          ] as InvalidateQueryFilters);
        }
      } catch (error) {
        console.log("Houve um erro ao tentar deletar contato.");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      faqQuestionsRepository,
      handleToggleDeleteFaqQuestionModal,
      queryClient,
      setIsLoading,
    ]
  );

  const handleUpdateFaqQuestion = useCallback(
    async (data: IUpdateFaqQuestionDTO) => {
      try {
        setIsLoading(true);
        if (selectedFaqQuestion) {
          await faqQuestionsRepository.updateFaqQuestion({
            ...data,
            id: selectedFaqQuestion.id,
          });
        }
        showAlertSuccess("FAQ atualizado com sucesso!");
        queryClient.invalidateQueries([
          "faq-questions",
        ] as InvalidateQueryFilters);
        handleToggleEditFaqQuestionModal();
        window.location.reload();
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          if (error.STATUS === 409) {
            showAlertError("Já existe uma pergunta com os dados fornecidos.");
          }
        } else {
          showAlertError(
            "Houve um erro ao tentar atualizar pergunta. Por favor, tente novamente mais tarde."
          );
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      faqQuestionsRepository,
      handleToggleEditFaqQuestionModal,
      queryClient,
      selectedFaqQuestion,
      setIsLoading,
    ]
  );

  const { error, isLoading } = useQuery({
    queryKey: ["faq-questions"],
    queryFn: getFaqQuestions,
  });

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <ScreenTitleIcon
          screenTitle="Perguntas frequentes"
          iconName="help-circle"
        />
        <Subtitle
          content="Defina e gerencie as perguntas mais frequentes que seus usuários possam ter."
          className="mt-4 mb-8 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
        />
        {isLoading || loading ? (
          <Loading color={PRIMARY_COLOR} />
        ) : error ? (
          <img
            src={theme === "light" ? error_warning : error_warning_dark}
            alt="error_loading_faq_questions"
          />
        ) : (
          <FaqCollapsibleCard
            questions={faqQuestions}
            onDeleteQuestion={handleToggleDeleteFaqQuestionModal}
            onEditQuestion={handleToggleEditFaqQuestionModal}
            onSelectQuestion={getFaqQuestion}
          />
        )}
        <DeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleToggleDeleteFaqQuestionModal}
          onRequestClose={handleToggleDeleteFaqQuestionModal as never}
          onConfirmAction={() =>
            handleDeleteContactSupport(
              selectedFaqQuestion ? selectedFaqQuestion.id : ""
            )
          }
          resource="pergunta"
        />
        <EditFaqQuestionModal
          isOpen={isEditModalOpen}
          onClose={handleToggleEditFaqQuestionModal as never}
          onRequestClose={handleToggleEditFaqQuestionModal as never}
          onConfirmAction={handleUpdateFaqQuestion}
          selectedFaqQuestionId={selectedFaqQuestion && selectedFaqQuestion.id}
          isLoading={loading}
        />
      </div>
    </main>
  );
}
