import { Loading } from "@/components/miscellaneous/Loading";
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
import Player from "react-player";

interface WatchClassModalProps {
  classToWatch: string | null;
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onClose: () => void;
  videoUrl: string | null;
}

export function WatchClassModal({
  isOpen,
  onRequestClose,
  onClose,
  classToWatch,
  videoUrl,
}: WatchClassModalProps) {
  const { theme } = useThemeStore();

  const extendedStyles =
    theme === "light"
      ? {
          ...reactModalCustomStyles,
          content: {
            ...reactModalCustomStyles.content,
            width: "800px",
            margin: "0 auto",
          },
        }
      : {
          ...reactModalCustomStyles,
          content: {
            ...reactModalCustomStylesDark.content,
            width: "800px",
            margin: "0 auto",
          },
        };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={extendedStyles}
    >
      <div className="flex flex-row w-full justify-between items-start mb-2">
        {classToWatch && (
          <Title
            content={classToWatch}
            className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
          />
        )}
        <IconButton variant="text" onClick={onClose} className="mt-[-8px]">
          <RiCloseCircleLine className="md:h-8 md:w-8 h-5 w-5 text-red-500" />
        </IconButton>
      </div>
      <div className="w-full h-[400px] bg-black flex items-center justify-center">
        {videoUrl ? (
          <Player
            url={videoUrl}
            controls
            width="100%"
            style={{ aspectRatio: 16 / 9 }}
            volume={1}
          />
        ) : (
          <div className="w-full flex flex-col items-center justify-center">
            <Loading hideText />
            <span className="text-[12px] md:text-[16px] text-gray-200 text-center m-4">
              Sua videoaula está em processamento e será exibida após o
              processamento finalizar.
            </span>
            <span className="text-[12px] md:text-[16px] text-gray-200 text-center m-1">
              Por favor, aguarde.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
}
