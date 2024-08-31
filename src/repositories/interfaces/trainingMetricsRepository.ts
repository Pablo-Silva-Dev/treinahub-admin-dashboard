import { ITrainingMetricsDTO } from "../dtos/TrainingMetricDTO";

export interface ITrainingMetricsRepository {
  listTrainingMetricsByUser(userId: string): Promise<ITrainingMetricsDTO[]>;
}
