import { NAVIGATION_TIMER } from "@/appConstants/index";
import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { IRegisterUserRequest } from "@/repositories/interfaces/usersRepository";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import SignUpForm from "./components/SignUpForm";
import { UseTermsModal } from "./components/UseTermsModal";

export default function SignUp() {
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

  const handleSubmit = async (data: IRegisterUserRequest) => {
    try {
      setIsLoading(true);
      const { phone } = data;
      const brazilianPhoneCode = "+55";
      const completePhone = brazilianPhoneCode + phone;
      const response = await usersRepository.registerUser({
        ...data,
        is_admin: true,
        phone: completePhone,
      });
      if (response.id) {
        showAlertSuccess("Cadastro realizado com sucesso!");
        setTimeout(() => {
          navigate("/");
        }, NAVIGATION_TIMER);
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        const typedError = error as { STATUS: number };
        switch (typedError.STATUS) {
          case 404:
            showAlertError("Empresa não encontrada.");
            break;
          case 403:
            showAlertError("Empresa ainda não realizou a assinatura.");
            break;
          case 409:
            showAlertError("Já existe um usuário com os dados informados.");
            break;
          default:
            console.log(error);
        }
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
      <div className="flex flex-row mb-2 w-full sm:w-[400px] sm:mx-auto">
        <HeaderNavigation screenTitle="Cadastro" />
      </div>

      <SignUpForm
        onSubmit={handleSubmit}
        onOpenUseTermsModal={handleToggleUseTermsModal}
        onOpenPrivacyPolicyModal={handleTogglePrivacyPolicyModal}
        isLoading={isLoading}
        passwordConfirmation={passwordConfirmation}
        setPasswordConfirmation={setPasswordConfirmation}
        companiesList={companiesList}
      />

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
