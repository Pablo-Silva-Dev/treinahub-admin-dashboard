import {
  FREE_EMPLOYEES_LIMIT_BRONZE_PLAN,
  FREE_EMPLOYEES_LIMIT_GOLD_PLAN,
  FREE_EMPLOYEES_LIMIT_SILVER_PLAN,
} from "@/appConstants/index";
import businessPlaceholder from "@/assets/business_placeholder.svg";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { unformatPhoneNumber } from "@/utils/formats";
import { Avatar, Tooltip } from "@material-tailwind/react";
import { useMemo } from "react";
import { MdDelete, MdEdit, MdOutlinePhotoCamera } from "react-icons/md";
import { PlanStorageProgressCard } from "../PlanStorageProgressCard";

interface CompanyInfoCardProps {
  company: ICompanyDTO;
  onDelete: () => void;
  onUpdate: () => void;
  onUpdateAddress: () => void;
  onUpdatePlan?: () => void;
  onUpdateLogo: () => void;
}

export function CompanyInfoCard({
  company,
  onDelete,
  onUpdateLogo,
  onUpdate,
  onUpdateAddress,
}: CompanyInfoCardProps) {
  const totalEmployees = useMemo(() => {
    if (company.users) {
      return company.users.filter((user) => !user.is_admin).length;
    }
  }, [company.users]);

  const totalFreeEmployees = useMemo(() => {
    const totalEmployees =
      company.current_plan === "bronze"
        ? FREE_EMPLOYEES_LIMIT_BRONZE_PLAN
        : company.current_plan === "silver"
          ? FREE_EMPLOYEES_LIMIT_SILVER_PLAN
          : FREE_EMPLOYEES_LIMIT_GOLD_PLAN;
    return totalEmployees;
  }, [company.current_plan]);

  return (
    <div className="w-full flex flex-col  bg-white dark:bg-slate-700 p-4 rounded-md mb-2">
      <div className="w-full flex flex-col mb-4">
        <div className="w-full flex flex-row mb-4">
          <Avatar
            src={company.logo_url ? company.logo_url : businessPlaceholder}
            size="xl"
            variant="rounded"
          />
          <Tooltip content="Atualizar logo da empresa">
            <button
              className="flex justify-center items-center bg-primary-light h-6 w-6 lg:h-7 lg:w-7 rounded-full mt-[40px] ml-[-12px] z-10"
              onClick={onUpdateLogo}
            >
              <MdOutlinePhotoCamera className="text-gray-50 h-4 w-4" />
            </button>
          </Tooltip>

          <div className="w-full flex flex-col md:flex-row md:items-center ml-3">
            <button
              className="flex items-center justify-between bg-transparent text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md border-2 border-black dark:border-white text-[12px] md:text-[14px] mr-3 mb-2"
              onClick={onUpdate}
            >
              Alterar dados
              <MdEdit className="w-4 h-4 lg:w-5 lg:h-5 dark:text-gray-50 ml-1" />
            </button>
            <button
              className="flex items-center justify-between bg-transparent text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md border-2 border-black dark:border-white text-[12px] md:text-[14px] mr-3 mb-2"
              onClick={onUpdateAddress}
            >
              Alterar endereço
              <MdEdit className="w-4 h-4 lg:w-5 lg:h-5 dark:text-gray-50 ml-1" />
            </button>
            {/* TODO-PABLO: Integrate redirection to Stripe upgrade plan screen*/}
            {/* <button className="flex items-center justify-between bg-primary text-gray-100 py-2 px-4 rounded-md mr-3 mb-2 border-2 border-primary text-[12px] md:text-[14px]">
              Mudar plano
              <MdAttachMoney className="w-4 h-4 lg:w-5 lg:h-5 text-gray-100" />
            </button> */}
            <button
              className="flex items-center justify-between text-red-300 py-2 px-4 mr-3  mb-2 rounded-md border-2 border-red-500 text-[12px] md:text-[14px]"
              onClick={onDelete}
            >
              Cancelar assinatura e remover empresa
              <MdDelete className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
            </button>
          </div>
        </div>

        <div className="w-full bg-purple flex flex-col md:flex-row">
          <div className="w-full">
            <div className="w-full mb-2">
              <h2 className="text-[16px] md:text-[20px] text-gray-800 dark:text-gray-200 font-bold">
                Informações da empresa
              </h2>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200 font-bold">
                Nome fantasia
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.fantasy_name}
              </span>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200 font-bold">
                Razão social
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.social_reason}
              </span>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Email
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.email}
              </span>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Telefone
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.phone
                  ? unformatPhoneNumber(company.phone)
                  : "Não informado"}
              </span>
            </div>

            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Número de funcionários
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.number_of_employees}
              </span>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Setor de atuação
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.company_sector}
              </span>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full mb-2">
              <h2 className="text-[16px] md:text-[20px] text-gray-800 dark:text-gray-200 font-bold">
                Informações de endereço da empresa
              </h2>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200 font-bold">
                Cep
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.cep}
              </span>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200 font-bold">
                Rua
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.street}
              </span>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Número
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.residence_number}
              </span>
            </div>

            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Complemento
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.residence_complement}
              </span>
            </div>

            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Bairro
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.district}
              </span>
            </div>

            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Cidade
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.city}
              </span>
            </div>

            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Estado
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.uf}
              </span>
            </div>
          </div>

          <div className="w-full">
            <div className="w-full mb-2">
              <h2 className="text-[16px] md:text-[20px] text-gray-800 dark:text-gray-200 font-bold">
                Informações do plano e consumo da empresa
              </h2>
            </div>
            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                Plano atual
              </span>
              <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                {company.current_plan.toUpperCase()}
              </span>
            </div>

            {company.users && (
              <div className="w-full flex flex-col mb-4">
                <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                  Número de colaboradores na plataforma
                </span>
                <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                  {totalEmployees}
                </span>
              </div>
            )}
            {company.users && (
              <div className="w-full flex flex-col mb-4">
                <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                  Número de colaboradores gratuitos inclusos no plano
                </span>
                <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                  {totalFreeEmployees}
                </span>
              </div>
            )}
            {company.users && (
              <div className="w-full flex flex-col mb-4">
                <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200  font-bold">
                  Número de colaboradores adicionais
                </span>
                <span className="text-[12px] md:text-[14px] text-gray-700 dark:text-gray-300">
                  {company.number_of_additional_employees}
                </span>
              </div>
            )}

            <div className="w-full flex flex-col mb-4">
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200 font-bold">
                Storage utilizado
              </span>
              <PlanStorageProgressCard
                consumedStorage={company.used_storage}
                plan={company.current_plan}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-end items-end"></div>
    </div>
  );
}
