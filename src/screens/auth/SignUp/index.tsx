import { NAVIGATION_TIMER } from "@/appConstants/index";
import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import SignUpForm from "./components/SignUpForm";
import { UseTermsModal } from "./components/UseTermsModal";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";

export function SignUp() {
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [companiesList, setCompaniesList] = useState<ICompanyDTO[]>([]);

  const usersRepository = useMemo(() => {
    return new UsersRepositories();
  }, []);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const companies = await companiesRepository.listCompanies();
      setCompaniesList(companies);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [companiesRepository, setIsLoading]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { phone } = data;
      const brazilianPhoneCode = "+55";
      const completePhone = brazilianPhoneCode + phone;
      await usersRepository.registerUser({
        ...data,
        is_admin: true,
        phone: completePhone,
      });
      showAlertSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, NAVIGATION_TIMER);
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        const typedError = error as { STATUS: number };
        if (typedError.STATUS === 409)
          showAlertError(
            "Já existe um usuário cadastrado com os dados informados."
          );
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [useTermsModal, setUseTermsModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);

  const handleToggleUseTermsModal = () => {
    setUseTermsModal(!useTermsModal);
  };

  const handleTogglePrivacyPolicyModal = () => {
    setPrivacyPolicyModal(!privacyPolicyModal);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2 w-full sm:w-[400px] ml-8 sm:mx-auto">
        <HeaderNavigation screenTitle="Cadastro" />
      </div>
      {!isLoading && (
        <SignUpForm
          onSubmit={handleSubmit}
          onOpenUseTermsModal={handleToggleUseTermsModal}
          onOpenPrivacyPolicyModal={handleTogglePrivacyPolicyModal}
          isLoading={isLoading}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          companiesList={companiesList}
        />
      )}
      <UseTermsModal
        onClose={handleToggleUseTermsModal}
        isOpen={useTermsModal}
      />
      <PrivacyPolicyModal
        onClose={handleTogglePrivacyPolicyModal}
        isOpen={privacyPolicyModal}
      />
    </div>
  );
}
