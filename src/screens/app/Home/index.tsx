import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import GreetUser from "@/components/miscellaneous/GreetUser";
import { Loading } from "@/components/miscellaneous/Loading";
import { Title } from "@/components/typography/Title";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { useQueries } from "@tanstack/react-query";
import Feather from "feather-icons-react";
import { useCallback, useMemo } from "react";
import MetricsCard from "./components/MetricsCard";

export default function Home() {
  const { user } = useAuthenticationStore();
  const { theme } = useThemeStore();

  const usersRepository = useMemo(() => {
    return new UsersRepositories();
  }, []);
  const trainingsRepository = useMemo(() => {
    return new TrainingsRepositories();
  }, []);
  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);
  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const users = await usersRepository.listUsers(user.companyId);
      return users;
    } catch (error) {
      console.log(error);
    }
  }, [user.companyId, usersRepository]);

  const getTrainings = useCallback(async () => {
    try {
      const trainings = await trainingsRepository.listTrainings(user.companyId);
      return trainings;
    } catch (error) {
      console.log(error);
    }
  }, [trainingsRepository, user.companyId]);

  const getCertificates = useCallback(async () => {
    try {
      const certificates = await certificatesRepository.listCertificates();
      return certificates;
    } catch (error) {
      console.log(error);
    }
  }, [certificatesRepository]);

  const getVideoClasses = useCallback(async () => {
    try {
      const videoClasses = await videoClassesRepository.listVideoClassesByCompany(user.companyId);
      return videoClasses;
    } catch (error) {
      console.log(error);
    }
  }, [user.companyId, videoClassesRepository]);

  const queries = useQueries({
    queries: [
      { queryKey: ["users"], queryFn: getUsers },
      { queryKey: ["trainings"], queryFn: getTrainings },
      { queryKey: ["certificates"], queryFn: getCertificates },
      { queryKey: ["video-classes"], queryFn: getVideoClasses },
    ],
  });

  const [usersQuery, trainingsQuery, certificatesQuery, videoClassesQuery] =
    queries;

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  const totalUsers = usersQuery.data ? usersQuery.data.length : 0;
  const totalTrainings = trainingsQuery.data ? trainingsQuery.data.length : 0;
  const totalVideoClasses = videoClassesQuery.data
    ? videoClassesQuery.data.length
    : 0;
  const totalCertificates = certificatesQuery.data
    ? certificatesQuery.data.length
    : 0;

  const dashboardMetrics = [
    {
      title: "Usuarios cadastrados",
      iconName: "users",
      metric: totalUsers,
      link: "/dashboard/gerenciar-usuarios",
    },
    {
      title: "Treinamentos cadastrados",
      iconName: "book-open",
      metric: totalTrainings,
      link: "/dashboard/gerenciar-treinamentos",
    },
    {
      title: "Videoaulas adicionadas",
      iconName: "play-circle",
      metric: totalVideoClasses,
      link: "/dashboard/gerenciar-videoaulas",
    },
    {
      title: "Certificados emitidos",
      iconName: "star",
      metric: totalCertificates,
      link: "/dashboard/consultar-certificados",
    },
  ];

  return (
    <main className="w-full flex flex-1  flex-col p-4">
      <div className=" w-full flex flex-col">
        <div className="flex flex-col justify-between mb-6 mx-auto md:mx-[120px] w-[80%]">
          <GreetUser userName={user.name} />
          <div className="flex w-full">
            <Feather
              icon="bar-chart-2"
              className="w-10 h-10 mr-2 text-black dark:text-white"
            />
            <Title
              content="Visão geral da sua plataforma"
              className="m-2 text-black dark:text-white text-lg md:text-xl font-bold font-secondary"
            />
          </div>
        </div>
        {isLoading ? (
          <div className="w-full mt-10">
            <Loading color={PRIMARY_COLOR} />
          </div>
        ) : hasError ? (
          <div className="w-full flex flex-row justify-center">
            <img
              src={theme === "light" ? error_warning : error_warning_dark}
              alt="ps_trainings"
            />
          </div>
        ) : (
          <div className="w-[75%] lg:w-[80%] grid grid-cols-1 md:grid-cols-2 gap-4 ml-[15%] md:ml-[120px]">
            {dashboardMetrics.map((metric) => (
              <MetricsCard
                key={metric.title}
                title={metric.title}
                iconName={metric.iconName}
                metric={metric.metric}
                link={metric.link}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
