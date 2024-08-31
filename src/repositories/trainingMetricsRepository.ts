import { api, IApiSuccessResponse } from "@/services/api";
import { ITrainingMetricsDTO } from "./dtos/TrainingMetricDTO";
import { ITrainingMetricsRepository } from "./interfaces/trainingMetricsRepository";

export class TrainingMetricsRepository implements ITrainingMetricsRepository {
  async listTrainingMetricsByUser(
    userId: string
  ): Promise<ITrainingMetricsDTO[]> {
    try {
      const response = await api.get<
        IApiSuccessResponse<ITrainingMetricsDTO[]>
      >(`/training-metrics/list-by-user/${userId}`);
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
