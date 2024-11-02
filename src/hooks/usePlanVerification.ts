import { CompaniesRepository } from "@/repositories/companiesRepository";
import { TPlan } from "@/repositories/dtos/CompanyDTO";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { IVideoClassDTO } from "@/repositories/dtos/VideoClassDTO";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN,
  MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN,
  MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN,
} from "../appConstants";

export const usePlanVerification = () => {
  const [currentCompanyPlan, setCurrentCompanyPlan] = useState<TPlan>("gold");
  const [trainings, setTrainings] = useState<ITrainingDTO[]>([]);
  const [videoClasses, setVideoClasses] = useState<IVideoClassDTO[]>([]);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const { user } = useAuthenticationStore();
  const { isLoading, setIsLoading } = useLoading();

  const getCompanyPlan = useCallback(async () => {
    try {
      const { current_plan, trainings } = await companiesRepository.getCompany(
        user.companyId
      );
      setCurrentCompanyPlan(current_plan);
      if (trainings) {
        setTrainings(trainings);
      }
    } catch (error) {
      console.log(error);
    }
  }, [companiesRepository, user.companyId]);

  useEffect(() => {
    getCompanyPlan();
  }, [getCompanyPlan]);

  const getVideoClassesByTraining = useCallback(
    async (trainingId: string) => {
      try {
        if (trainingId) {
          setIsLoading(true);
          const videoClasses =
            await videoClassesRepository.listVideoClassesByTrainingId(
              trainingId
            );
          setVideoClasses(videoClasses);
          return videoClasses;
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, videoClassesRepository]
  );

  const maxTrainingsAllowed =
    currentCompanyPlan === "gold"
      ? MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN
      : currentCompanyPlan === "platinum"
        ? MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN
        : MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN;

  const canRegisterMoreTrainings = useMemo(() => {
    if (
      currentCompanyPlan === "gold" &&
      trainings.length < MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN
    )
      return true;
    if (
      currentCompanyPlan === "platinum" &&
      trainings.length < MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN
    )
      return true;
    if (
      currentCompanyPlan === "diamond" &&
      trainings.length < MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN
    )
      return true;
    return false;
  }, [currentCompanyPlan, trainings.length]);

  const addTraining = (training: ITrainingDTO) => {
    setTrainings((prevTrainings) => [...prevTrainings, training]);
  };

  const removeTraining = (trainingId: string) => {
    const filteredTrainings = trainings.filter((t) => t.id === trainingId);
    setTrainings(filteredTrainings);
  };

  const canRegisterMoreVideoClasses = useMemo(() => {
    if (
      currentCompanyPlan === "gold" &&
      videoClasses.length < MAX_TRAININGS_CREATION_ALLOWED_GOLD_PLAN
    )
      return true;
    if (
      currentCompanyPlan === "platinum" &&
      videoClasses.length < MAX_TRAININGS_CREATION_ALLOWED_PLATINUM_PLAN
    )
      return true;
    if (
      currentCompanyPlan === "diamond" &&
      videoClasses.length < MAX_TRAININGS_CREATION_ALLOWED_DIAMOND_PLAN
    )
      return true;
    return false;
  }, [currentCompanyPlan, videoClasses.length]);

  const addVideoClass = (videoClass: IVideoClassDTO) => {
    setTrainings((prevVideoClasses) => [...prevVideoClasses, videoClass]);
  };


  return {
    companyPlan: currentCompanyPlan,
    maxTrainingsAllowed,
    canRegisterMoreTrainings,
    addTraining,
    removeTraining,
    canRegisterMoreVideoClasses,
    addVideoClass,
    getVideoClassesByTraining,
    isFetching: isLoading,
  };
};
