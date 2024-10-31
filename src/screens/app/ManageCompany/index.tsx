import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CompanyInfoCard } from "./components/CompanyCard";

export function ManageCompany() {
  const [company, setCompany] = useState<ICompanyDTO | null>(null);

  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();

  const { isLoading } = useLoading();

  const error = "";

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompany = useCallback(async () => {
    try {
      const company = await companiesRepository.getCompany(user.companyId);
      setCompany(company);
    } catch (error) {
      console.log(error);
    }
  }, [companiesRepository, user.companyId]);

  useEffect(() => {
    getCompany();
  }, [getCompany]);

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-4 ml-4">
            <ScreenTitleIcon screenTitle="Empresa" iconName="briefcase" />
            <Subtitle
              content="Consulte, gerencie os dados e atualize o plano da empresa."
              className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
            />
          </div>
        </div>
        {isLoading ? (
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
          <div
            className="w-full px-4 mt-2 flex flex-col max-h-[560px] overflow-y-auto"
            style={{ height: 560 }}
          >
            {company && (
              <CompanyInfoCard
                company={company}
                onDelete={() => console.log("Company removed")}
              />
            )}
          </div>
        )}
      </div>
      {/* <DeleteModal
        resource="questionário"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal as never}
        onConfirmAction={() => handleDeleteQuiz(selectedQuiz!.id)}
      /> */}
    </main>
  );
}
