import { CompaniesRepository } from "@/repositories/companiesRepository";
import { TPlan } from "@/repositories/dtos/CompanyDTO";
import { useAuthenticationStore } from "@/store/auth";
import { useCallback, useEffect, useMemo, useState } from "react";

export const usePlanVerification = () => {
  const [currentCompanyPlan, setCurrentCompanyPlan] = useState<TPlan>("gold");

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const { user } = useAuthenticationStore();

  const getCompanyPlan = useCallback(async () => {
    try {
      const { current_plan } = await companiesRepository.getCompany(
        user.companyId
      );
      setCurrentCompanyPlan(current_plan);
    } catch (error) {
      console.log(error);
    }
  }, [companiesRepository, user.companyId]);

  useEffect(() => {
    getCompanyPlan();
  }, [getCompanyPlan]);

  return {
    companyPlan: currentCompanyPlan,
  };
};
