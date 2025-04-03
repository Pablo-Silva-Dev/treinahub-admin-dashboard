import { CompaniesRepository } from "@/repositories/companiesRepository";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  STORAGE_LIMIT_BRONZE_PLAN,
  STORAGE_LIMIT_GOLD_PLAN,
  STORAGE_LIMIT_SILVER_PLAN,
} from "../appConstants";

export function usePlan() {
  const [company, setCompany] = useState<ICompanyDTO | null>(null);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const { setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();

  const getCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      const company = await companiesRepository.getCompany(user.companyId);
      if (company) {
        setCompany(company);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [companiesRepository, setIsLoading, user.companyId]);

  useEffect(() => {
    getCompany();
  }, [getCompany]);

  const exceededStorage = useMemo(() => {
    let planLimitExceeded = false;
    if (company) {
      if (
        (company.current_plan === "bronze_mensal" || company.current_plan === "bronze_anual" &&
          company.used_storage >= STORAGE_LIMIT_BRONZE_PLAN) ||
        (company.current_plan === "silver_mensal" || company.current_plan === "silver_anual" &&
          company.used_storage >= STORAGE_LIMIT_SILVER_PLAN) ||
        (company.current_plan === "gold_mensal" || company.current_plan === "gold_anual" &&
          company.used_storage >= STORAGE_LIMIT_GOLD_PLAN)
      ) {
        planLimitExceeded = true;
        return planLimitExceeded;
      }
    }
    return planLimitExceeded;
  }, [company]);

  return { exceededStorage };
}
