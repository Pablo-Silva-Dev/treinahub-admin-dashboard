import { REQUIRED_FIELD_MESSAGE } from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { SelectInput } from "@/components/inputs/SelectInput";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { QuizzesRepository } from "@/repositories/quizzesRepository";
import { TrainingsRepositories } from "@/repositories/trainingsRepository";
import { useLoading } from "@/store/loading";
import { showAlertSuccess } from "@/utils/alerts";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface RegisterQuizInputs {
  training_id: string;
}

type IOption = {
  label: string;
  value: string;
};

export function RegisterQuiz() {
  const [trainingsOptionsList, setTrainingsOptionsList] = useState<IOption[]>(
    []
  );
  const [selectedTraining, setSelectedTraining] = useState<ITrainingDTO | null>(
    null
  );

  const { isLoading, setIsLoading } = useLoading();

  const validationSchema = yup.object({
    training_id: yup.string().required(REQUIRED_FIELD_MESSAGE),
  });

  const {
    handleSubmit,
    formState: { isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const quizzesRepository = useMemo(() => {
    return new QuizzesRepository();
  }, []);

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepositories();
  }, []);

  const handleTrainingSelect = async (selectedOption: { value: string }) => {
    setValue("training_id", selectedOption.value, { shouldValidate: true });
    try {
      const trainingDetails = await trainingsRepository.getTrainingById(
        selectedOption.value
      );
      if (trainingDetails) {
        setSelectedTraining(trainingDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setTrainingsOptions = useCallback(async () => {
    try {
      setIsLoading(true);
      const trainingsRepositories = new TrainingsRepositories();
      const trainings = await trainingsRepositories.listTrainings();

      const trainingsOptions = trainings.map((training) => ({
        label: training.name,
        value: training.id,
      }));

      setTrainingsOptionsList(trainingsOptions);
    } catch (error) {
      console.log("Error at trying to list trainings: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading]);

  const handleRegisterQuiz: SubmitHandler<RegisterQuizInputs> =
    useCallback(async () => {
      try {
        setIsLoading(true);
        if (selectedTraining) {
          const { id } = selectedTraining;
          await quizzesRepository.createQuiz({
            training_id: id,
          } as never);
          showAlertSuccess("Questionário cadastrado com sucesso!");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, [quizzesRepository, selectedTraining, setIsLoading]);

  useEffect(() => {
    setTrainingsOptions();
  }, [setTrainingsOptions]);

  return (
    <main className="flex flex-1 flex-col bg-gray-100 dark:bg-slate-800 w-full">
      <div className="flex flex-col items-center w-[90%] lg:w-[560px] mx-auto">
        <div className="mb-4 w-full">
          <ScreenTitleIcon
            screenTitle="Cadastrar questionário"
            iconName="play-circle"
          />
        </div>
        <form className="w-full" onSubmit={handleSubmit(handleRegisterQuiz)}>
          <div className="w-full flex flex-col md:flex-row mb-6">
            <div className="w-full">
              <SelectInput
                label="Selecione um treinamento para dar início a criação do questionário"
                options={trainingsOptionsList}
                onSelectOption={handleTrainingSelect as never}
                placeholder="Selecione um treinamento"
                defaultValue="Selecione um treinamento"
                widthVariant="mid"
              />
            </div>
          </div>

          <div className="w-full mt-2">
            <Button
              title="Cadastrar Questionário"
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !isValid}
            />
          </div>
        </form>
      </div>
    </main>
  );
}
