import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { DeleteModal } from "@/components/miscellaneous/DeleteModal";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import {
  ICompanyDTO,
  IUpdatableCompanyDTO,
  IUpdateCompanyLogoDTO,
} from "@/repositories/dtos/CompanyDTO";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { formatPhoneNumber } from "@/utils/formats";
import {
  InvalidateQueryFilters,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CompanyInfoCard } from "./components/CompanyCard";
import { EditCompanyModal } from "./components/EditCompanyModal";
import { UpdateCompanyLogoModal } from "./components/UpdateCompanyLogoModal";

export function ManageCompany() {
  const [company, setCompany] = useState<ICompanyDTO | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateCompanyLogoModalOpen, setIsUpdateCompanyLogoModalOpen] =
    useState(false);
  const [isUpdateCompanyModalOpen, setIsUpdateCompanyModalOpen] =
    useState(false);
  const [logoKey, setLogoKey] = useState(Date.now());

  const { theme } = useThemeStore();
  const { user, signOut } = useAuthenticationStore();

  const { isLoading, setIsLoading } = useLoading();
  const queryClient = useQueryClient();

  const handleToggleDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }, [isDeleteModalOpen]);

  const handleToggleUpdateCompanyLogoModal = useCallback(() => {
    setIsUpdateCompanyLogoModalOpen(!isUpdateCompanyLogoModalOpen);
  }, [isUpdateCompanyLogoModalOpen]);

  const handleToggleUpdateCompanyModal = useCallback(() => {
    setIsUpdateCompanyModalOpen(!isUpdateCompanyModalOpen);
  }, [isUpdateCompanyModalOpen]);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      const company = await companiesRepository.getCompany(user.companyId);
      setCompany(company);
      return company;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [companiesRepository, setIsLoading, user.companyId]);

  const handleUpdateCompanyLogo = useCallback(
    async (data: IUpdateCompanyLogoDTO) => {
      try {
        setIsLoading(true);
        await companiesRepository.updateCompanyLogo({
          ...data,
          id: user.companyId,
        });
        handleToggleUpdateCompanyLogoModal();
        setLogoKey(Date.now());
        showAlertSuccess("Logo atualizada com sucesso!");
      } catch (error) {
        showAlertError(
          "Houve um erro ao tentar atualizar logo da empresa. Por favor, tente novamente mais tarde."
        );
        console.log("Error at updating company logo: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      companiesRepository,
      handleToggleUpdateCompanyLogoModal,
      setIsLoading,
      user.companyId,
    ]
  );

  const handleUpdateCompany = useCallback(
    async (data: IUpdatableCompanyDTO) => {
      const { phone } = data;
      try {
        setIsLoading(true);
        if (phone) {
          await companiesRepository.updateCompany({
            ...data,
            id: user.companyId,
            phone: formatPhoneNumber(phone),
          });
        } else {
          await companiesRepository.updateCompany({
            ...data,
            id: user.companyId,
          });
        }
        showAlertSuccess("Dados da empresa atualizados com sucesso!");
        handleToggleUpdateCompanyModal();
        queryClient.invalidateQueries(["company"] as InvalidateQueryFilters);
      } catch (error) {
        showAlertError(
          "Houve um erro ao tentar atualizar dados da empresa. Por favor, tente novamente mais tarde."
        );
        console.log("Error at updating company logo: ", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      companiesRepository,
      handleToggleUpdateCompanyModal,
      queryClient,
      setIsLoading,
      user.companyId,
    ]
  );

  useEffect(() => {
    getCompany();
  }, [getCompany, handleUpdateCompanyLogo]);

  const { error } = useQuery({
    queryKey: ["company"],
    queryFn: getCompany,
  });

  const handleDeleteCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      await companiesRepository.deleteCompany(user.companyId);
      signOut();
    } catch (error) {
      showAlertError(
        "Houve um erro ao tentar remover empresa. Por favor, tente novamente mais tarde."
      );
      console.log("Error at deleting company: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [companiesRepository, setIsLoading, signOut, user.companyId]);

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
                onDelete={handleToggleDeleteModal}
                onUpdateLogo={handleToggleUpdateCompanyLogoModal}
                onUpdate={handleToggleUpdateCompanyModal}
              />
            )}
          </div>
        )}
      </div>
      <DeleteModal
        resource="empresa"
        isOpen={isDeleteModalOpen}
        onClose={handleToggleDeleteModal}
        onRequestClose={handleToggleDeleteModal}
        onConfirmAction={() => handleDeleteCompany()}
      />
      <UpdateCompanyLogoModal
        isOpen={isUpdateCompanyLogoModalOpen}
        onClose={handleToggleUpdateCompanyLogoModal}
        onRequestClose={handleToggleUpdateCompanyLogoModal}
        onConfirmAction={handleUpdateCompanyLogo}
        logoKey={logoKey.toString()}
      />
      <EditCompanyModal
        isOpen={isUpdateCompanyModalOpen}
        onClose={handleToggleUpdateCompanyModal}
        onRequestClose={handleToggleUpdateCompanyModal}
        onConfirmAction={handleUpdateCompany}
        isLoading={isLoading}
      />
    </main>
  );
}
