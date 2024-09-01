import { SelectInput } from "@/components/inputs/SelectInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { IUserDTO } from "@/repositories/dtos/UserDTO";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CourseProgressCard } from "./components/CourseProgressCard";
/* eslint-disable react-hooks/exhaustive-deps */
import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ITrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { useThemeStore } from "@/store/theme";
import { useQuery } from "@tanstack/react-query";

type SelectUserOption = {
  name: string;
  id: string;
};

export function FollowUserProgress() {
  const [selectedUser, setSelectedUser] = useState<SelectUserOption | null>(
    null
  );
  const [users, setUsers] = useState<IUserDTO[]>([]);
  const [userMetrics, setUserMetrics] = useState<ITrainingMetricsDTO[]>([]);

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const usersRepository = useMemo(() => {
    return new UsersRepositories();
  }, []);

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const getUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const users = await usersRepository.listUsers();
      setUsers(users);
      return users;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, usersRepository]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const usersOptionsList = users.map((user) => ({
    label: user.name,
    value: user.id,
  }));

  const { isLoading: loading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const getUserMetrics = useCallback(
    async (userId: string) => {
      try {
        setIsLoading(true);
        setUserMetrics([]);
        const userMetrics =
          await trainingMetricsRepository.listTrainingMetricsByUser(userId);
        setUserMetrics(userMetrics);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedUser, trainingMetricsRepository]
  );

  useEffect(() => {
    if (selectedUser) {
      getUserMetrics(selectedUser.id);
    }
  }, [getUserMetrics, selectedUser]);

  const selectedUserOption = selectedUser
    ? {
        value: selectedUser.id,
        label: selectedUser.name,
      }
    : null;

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Acompanhar progresso do usuário"
            iconName="activity"
          />
          <Subtitle
            content="Consulte o progresso de seus usuários."
            className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
          />
        </div>
        {isLoading || loading ? (
          <Loading color={PRIMARY_COLOR} />
        ) : error ? (
          <img
            src={theme === "light" ? error_warning : error_warning_dark}
            alt="ps-trainings"
          />
        ) : (
          <>
            <div className="w-full flex flex-row mb-4 items-center">
              <SelectInput
                label="Selecione um usuário para visualizar o progresso"
                options={usersOptionsList}
                value={selectedUserOption as never}
                onSelectOption={(val) => {
                  console.log("Selected option:", val);
                  setSelectedUser({
                    id: val.value.toString(),
                    name: val.label,
                  });
                }}
                placeholder="Selecione um usuário"
                defaultValue="Selecione um usuário"
                className="w-[30vw] min-w-[280px]"
              />
            </div>
            <div className="mt-2 mb-4 w-full">
              <Subtitle
                content={`${selectedUser && userMetrics.length > 0 ? `Listando progresso de ${selectedUser.name}` : "Não há dados para o usuário"}`}
              />
            </div>
            <div className="w-full flex flex-col max-h-[400px] overflow-y-auto">
              {userMetrics.map((metrics) => (
                <CourseProgressCard
                  totalCourseClasses={metrics.total_training_classes}
                  totalWatchedClasses={metrics.total_watched_classes}
                  key={metrics.id}
                  course={metrics.training!.name}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
