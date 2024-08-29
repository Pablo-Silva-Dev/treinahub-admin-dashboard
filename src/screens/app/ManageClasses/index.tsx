/* eslint-disable react-hooks/exhaustive-deps */
import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { PlusButton } from "@/components/buttons/PlusButton";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import {
  IUpdateVideoClassDTO,
  IVideoClassDTO,
} from "@/repositories/dtos/VideoClassDTO";
import { ITrainingDTO } from "@/repositories/interfaces/trainingsRepository";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import {
  showAlertError,
  showAlertLoading,
  showAlertSuccess,
} from "@/utils/alerts";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { DeleteModal } from "../../../components/miscellaneous/DeleteModal";
import { VideoClassesTable } from "./components/ClassesTable";
import { EditClassModal } from "./components/EditClassModal";
import { WatchClassModal } from "./components/WatchClassmodal";

export function ManageClasses() {
  const [isDeleteModalOpen, setIsDeleteModalClassOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditModalClassOpen] = useState(false);
  const [isWatchClassModalOpen, setIsWatchModalClassOpen] = useState(false);
  const [videoClasses, setVideoClasses] = useState<IVideoClassDTO[]>([]);
  const [trainings, setTrainings] = useState<ITrainingDTO[]>([]);
  const [selectedVideoClass, setSelectedVideoClass] =
    useState<IVideoClassDTO | null>(null);
  const [selectedTrainingId, setSelectedTrainingId] = useState("");

  const queryClient = useQueryClient();
  const { theme } = useThemeStore();
  const { isLoading: loading, setIsLoading } = useLoading();

  const videoClassesRepositories = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const trainingsRepositories = useMemo(() => {
    return new TrainingsRepositories();
  }, []);

  const handleToggleEditClassModal = () => {
    setIsEditModalClassOpen(!isEditClassModalOpen);
  };
  const handleToggleDeleteModal = () => {
    setIsDeleteModalClassOpen(!isDeleteModalOpen);
  };
  const handleToggleWatchClassModal = () => {
    setIsWatchModalClassOpen(!isWatchClassModalOpen);
  };

  const getVideoClass = useCallback(
    async (videoClassId: string) => {
      try {
        const videoClass =
          await videoClassesRepositories.getVideoClassById(videoClassId);
        setSelectedVideoClass(videoClass);
      } catch (error) {
        console.log(error);
      }
    },
    [videoClassesRepositories]
  );

  const getVideoClasses = useCallback(async () => {
    try {
      let videoClassesList = [];
      if (selectedTrainingId === "") {
        videoClassesList = await videoClassesRepositories.listVideoClasses();
      } else {
        videoClassesList =
          await videoClassesRepositories.listVideoClassesByTrainingId(
            selectedTrainingId
          );
      }
      setVideoClasses(videoClassesList);
      return videoClasses;
    } catch (error) {
      console.log(error);
    }
  }, [selectedTrainingId, videoClassesRepositories]);

  useEffect(() => {
    getVideoClasses();
  }, [getVideoClasses]);

  const getVideoClassesByTraining = useCallback(async (trainingId: string) => {
    try {
      const videoClassesList =
        await videoClassesRepositories.listVideoClassesByTrainingId(trainingId);
      setVideoClasses(videoClassesList);
      return videoClasses;
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getVideoClassesByTraining(selectedTrainingId);
  }, [getVideoClassesByTraining, selectedTrainingId]);

  const videoClassesQuery = useQuery({
    queryKey: ["video-classes"],
    queryFn: getVideoClasses,
  });

  const { isLoading, error } = videoClassesQuery;

  const handleDeleteUser = useCallback(
    async (videoClassId: string) => {
      try {
        setIsLoading(true);
        await videoClassesRepositories.deleteVideoClass(videoClassId);
        queryClient.invalidateQueries([
          "video-classes",
        ] as InvalidateQueryFilters);
        setIsDeleteModalClassOpen(false);
        showAlertSuccess("Videoaula deletada com sucesso!");
      } catch (error) {
        showAlertError(
          "Houve um erro ao deletar usuário. Por favor, tente novamente mais tarde."
        );
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, setIsLoading, videoClassesRepositories]
  );

  const handleUpdateVideoClass = useCallback(
    async (data: IUpdateVideoClassDTO) => {
      try {
        setIsLoading(true);
        showAlertLoading(
          "Estamos processando os novos dados da usa videoaula. Por favor, aguarde..."
        );
        if (data.img_file && data.video_file) {
          await videoClassesRepositories.updateVideoClass({
            ...data,
            id: selectedVideoClass!.id,
          });
        }
        queryClient.invalidateQueries([
          "video-classes",
        ] as InvalidateQueryFilters);
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          if (error.STATUS === 409) {
            showAlertError(
              "Já existe uma videoaula com o nome informado para este treinamento."
            );
          } else {
            showAlertError("Houve um erro ao tentar atualizar videoaula.");
          }
        }
        showAlertError("Houve um erro ao tentar atualizar videoaula.");
        console.log(error);
      } finally {
        setIsLoading(false);
        toast.dismiss("loading");
      }
    },
    [queryClient, selectedVideoClass]
  );

  const getTrainings = useCallback(async () => {
    try {
      const trainings = await trainingsRepositories.listTrainings();
      setTrainings(trainings);
      return videoClasses;
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getTrainings();
  }, [getTrainings]);

  const trainingOptions = trainings
    .map((t) => ({
      label: t.name,
      value: t.id,
    }))
    .concat({ label: "Todos os treinamentos", value: "" });

  useEffect(() => {
    if (selectedTrainingId === "") {
      setVideoClasses(videoClasses);
    }
  }, [selectedTrainingId]);

  return (
    <main className="flex flex-1 flex-col w-[90%] lg:w-full mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-3 ml-4">
            <ScreenTitleIcon screenTitle="Videoaulas" iconName="play-circle" />
          </div>
          <div className="mr-4">
            <Link to="/dashboard/cadastrar-videoaula">
              <PlusButton title="Cadastrar nova videoaula" />
            </Link>
          </div>
        </div>
        <div className="lg:w-full flex-col flex md:items-center px-4">
          {/* TODO-Pablo: update navigation params to receive classes from specific trainings */}
          {isLoading || loading ? (
            <div className="w-full mt-[10vh]">
              <Loading color={PRIMARY_COLOR} />
            </div>
          ) : error ? (
            <div className="w-full mt-[10vh] flex flex-col items-center justify-center">
              <img
                src={theme === "light" ? error_warning : error_warning_dark}
                alt="page_not_found"
                width={200}
                height={120}
              />
            </div>
          ) : (
            <div className="w-full flex flex-col">
              <div className="mb-4 mt-2  w-full max-w-[400px]">
                <SelectInput
                  label="Filtrar videoaulas por treinamento"
                  options={trainingOptions}
                  onSelectOption={(val) =>
                    setSelectedTrainingId(val.value.toString())
                  }
                  defaultValue="Selecione um treinamento"
                  placeholder="Selecione um treinamento"
                />
              </div>
              <VideoClassesTable
                classes={videoClasses}
                onDeleteVideoClass={handleToggleDeleteModal}
                onUpdateVideoClass={handleToggleEditClassModal as never}
                onWatchVideoClass={handleToggleWatchClassModal as never}
                onSelectVideoClass={getVideoClass}
                videoClass={selectedVideoClass as never}
              />
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        resource="conteúdo"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal}
        onConfirmAction={() => handleDeleteUser(selectedVideoClass!.id)}
      />
      <EditClassModal
        isOpen={isEditClassModalOpen}
        onClose={handleToggleEditClassModal}
        onRequestClose={handleToggleEditClassModal}
        onConfirmAction={handleUpdateVideoClass}
        isLoading={isLoading}
        selectedVideoClassId={selectedVideoClass && selectedVideoClass.id}
      />
      <WatchClassModal
        classToWatch={selectedVideoClass && selectedVideoClass.name}
        isOpen={isWatchClassModalOpen}
        onClose={handleToggleWatchClassModal}
        onRequestClose={handleToggleWatchClassModal}
        videoUrl={selectedVideoClass && selectedVideoClass.hls_encoding_url}
      />
    </main>
  );
}
