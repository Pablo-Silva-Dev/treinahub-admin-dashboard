import {
  STORAGE_LIMIT_BRONZE_PLAN,
  STORAGE_LIMIT_GOLD_PLAN,
  STORAGE_LIMIT_SILVER_PLAN,
} from "@/appConstants/index";
import { TPlan } from "@/repositories/dtos/CompanyDTO";

interface PlanStorageProgressCardProps {
  consumedStorage: number;
  plan: TPlan;
}

export function PlanStorageProgressCard({
  consumedStorage,
  plan,
}: PlanStorageProgressCardProps) {
  const availableStorage =
    plan === "gold_mensal" || plan === "gold_anual"
      ? STORAGE_LIMIT_GOLD_PLAN
      : plan === "silver_mensal" || plan === "silver_anual"
        ? STORAGE_LIMIT_SILVER_PLAN
        : STORAGE_LIMIT_BRONZE_PLAN;

  const consumedStoragePercentage = Number(
    (consumedStorage / availableStorage) * 100
  );

  const consumedStoragePercentageNumber = parseInt(
    String(consumedStoragePercentage)
  );

  return (
    <div className="w-[12rem] flex flex-col pt-2 rounded-lg items-center mb-2">
      <div className="flex flex-row w-full items-center justify-start">
        <div className="w-full md:h-[6px] h-[4px] bg-gray-300 rounded-md">
          <div
            className={`${consumedStoragePercentageNumber < 50 ? "bg-green-400" : consumedStoragePercentageNumber < 80 ? "bg-orange-400" : "bg-red-400"} md:h-[6px] h-[4px] rounded-md`}
            style={{ width: `${consumedStoragePercentage}%` }}
          />
        </div>
      </div>
      <div className="flex flex-row w-full items-center justify-start mt-2">
        <span className="text-gray-700 dark:text-gray-100 text-xs">
          {consumedStorage} de {availableStorage} GBs de armazenamento
          utilizados
        </span>
      </div>
    </div>
  );
}
