import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { IconButton } from "@material-tailwind/react";
import { KeyboardEvent, MouseEvent } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import Modal from "react-modal";

interface WatchClassModalProps {
  //TODO-Pablo: Define the class using real IClass properties
  classToWatch: string;
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onClose: () => void;
}

export function WatchClassModal({
  isOpen,
  onRequestClose,
  onClose,
  classToWatch,
}: WatchClassModalProps) {
  const { theme } = useThemeStore();

  const extendedStyles =
    theme === "light"
      ? {
          ...reactModalCustomStyles,
          content: {
            ...reactModalCustomStyles.content,
            width: "640px",
            margin: "0 auto",
          },
        }
      : {
          ...reactModalCustomStyles,
          content: {
            ...reactModalCustomStylesDark.content,
            width: "640px",
            margin: "0 auto",
          },
        };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={extendedStyles}
    >
      <div className="flex f-flex row w-full justify-between items-start mb-2">
        <Title
          content={classToWatch}
          className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
        />
        <IconButton variant="text" onClick={onClose} className="mt-[-8px]">
          <RiCloseCircleLine className="md:h-8 md:w-8 h-5 w-5 text-red-500" />
        </IconButton>
      </div>
      <iframe
        width="100%"
        src="https://www.youtube.com/embed/aqz-KE-bpKQ"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ aspectRatio: 16 / 9 }}
      />
    </Modal>
  );
}
