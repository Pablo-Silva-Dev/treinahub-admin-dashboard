import { privacyPolicy } from "@/data/privacyPolicy";
import { useThemeStore } from "@/store/theme";
import {
  reactTermsAndPolicyModalCustomStyles,
  reactTermsAndPolicyModalCustomStylesDark,
} from "@/styles/react-modal";
import { Button } from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";

interface PrivacyPolicyModalProps {
  isOpen: boolean;

  onClose: () => void;
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
}: PrivacyPolicyModalProps) {
  const { theme } = useThemeStore();
  return (
    <Modal
      onRequestClose={onClose}
      isOpen={isOpen}
      style={
        theme === "light"
          ? (reactTermsAndPolicyModalCustomStyles as never)
          : (reactTermsAndPolicyModalCustomStylesDark as never)
      }
    >
      <div className="w-full flex flex-row justify-end mr-2">
        <Button onClick={onClose} className="p-1 bg-transparent shadow-none">
          <MdClose className="h-6 w-6 text-red-200" />
        </Button>
      </div>

      <h1 className="text-gray-900 dark:text-gray-100 mb-4 text-[16px] md:text-lg font-bold">
        Política de Privacidade
      </h1>
      {privacyPolicy.map((section, sectionIndex) => (
        <div key={section.title}>
          <h2 className="text-gray-900 dark:text-gray-100 mt-6 mb-4 text-[14px] md:text-[16px] font-bold">
            {`${sectionIndex + 1}. ${section.title}`}
          </h2>
          <ul>
            {section.texts.map((text, textIndex) => (
              <li
                key={`${section.title}-${textIndex}`}
                className="text-gray-700 dark:text-gray-300 mb-2 text-[13px] md:text-[15px]"
              >
                {`${sectionIndex + 1}.${textIndex + 1} ${text}`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Modal>
  );
}
