import {
  MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN,
  MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN,
  MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { usePlanVerification } from "@/hooks/usePlanVerification";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import Modal from "react-modal";

interface TrainingsLimitPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePlan: () => void;
}

export function TrainingsLimitPlanModal({
  isOpen,
  onClose,
  onUpdatePlan,
}: TrainingsLimitPlanModalProps) {
  const { theme } = useThemeStore();
  const { companyPlan } = usePlanVerification();

  const maxTrainingsAllowed =
    companyPlan === "gold"
      ? MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN
      : companyPlan === "platinum"
        ? MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN
        : MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN;

  return (
    <Modal
      isOpen={isOpen}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Limite de treinamentos cadastrados alcançado"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content={`A empresa atingiu o limite de ${maxTrainingsAllowed} treinamentos cadastrados para o plano ${companyPlan.toUpperCase()}.`}
        className="mx-auto text-center text-gray-700 dark:text-gray-100 text-[13px] md:text-[14px] mb-2"
      />
      <Subtitle
        content="Atualize o plano da empresa para poder registrar mais treinamentos."
        className="mx-auto text-center text-gray-700 dark:text-gray-100 text-[13px] md:text-[14px] mb-4"
      />
      <Button onClick={onUpdatePlan} title="Fazer upgrade" />
      <button
        onClick={onClose}
        className="text-black dark:text-white bg-gray-200 dark:bg-slate-700  p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
      >
        Entendi
      </button>
    </Modal>
  );
}
