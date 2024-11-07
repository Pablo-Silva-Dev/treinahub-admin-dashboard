import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { unformatPhoneNumber } from "@/utils/formats";
import { Avatar, Tooltip } from "@material-tailwind/react";
import { MdDelete, MdEdit, MdOutlinePhotoCamera } from "react-icons/md";

interface CompanyInfoCardProps {
  company: ICompanyDTO;
  onDelete: () => void;
  onUpdate: () => void;
  onUpdatePlan?: () => void;
  onUpdateLogo: () => void;
}

export function CompanyInfoCard({
  company,
  onDelete,
  onUpdateLogo,
  onUpdate,
}: CompanyInfoCardProps) {
  return (
    <div className="w-full flex flex-col md:flex-row bg-white dark:bg-slate-700 p-4 rounded-md mb-2">
      <div className="w-full flex flex-col mb-4">
        <div className="flex flex-row mb-4">
          <Avatar src={company.logo_url} size="xl" variant="rounded" />
          <Tooltip content="Atualizar logo da empresa">
            <button
              className="flex justify-center items-center bg-primary-light h-6 w-6 lg:h-7 lg:w-7 rounded-full mt-[40px] ml-[-12px] z-10"
              onClick={onUpdateLogo}
            >
              <MdOutlinePhotoCamera className="text-gray-50 h-4 w-4" />
            </button>
          </Tooltip>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100 font-bold">
            Nome fantasia
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.fantasy_name}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100 font-bold">
            Razão social
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.social_reason}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100  font-bold">
            Email
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.email}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100  font-bold">
            Telefone
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.phone
              ? unformatPhoneNumber(company.phone)
              : "Não informado"}
          </span>
        </div>
        {company.users && (
          <div className="w-full flex flex-col mb-4">
            <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100  font-bold">
              Número de usuários na plataforma
            </span>
            <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
              {company.users.length}
            </span>
          </div>
        )}
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100  font-bold">
            Plano atual
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.current_plan.toUpperCase()}
          </span>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-end items-end">
        <div className="w-full md:w-[240px] flex flex-col">
          <button
            className="flex items-center justify-between bg-transparent text-gray-900 dark:text-gray-100 py-2 px-4 rounded-md mb-2 border-2 border-black dark:border-white text-[12px] md:text-[14px]"
            onClick={onUpdate}
          >
            Alterar dados
            <MdEdit className="w-4 h-4 lg:w-5 lg:h-5 dark:text-gray-50" />
          </button>
          {/* TODO-PABLO: Integrate redirection to Stripe upgrade plan screen*/}
          {/* <button className="flex items-center justify-between bg-black text-gray-100 py-2 px-4 rounded-md mb-2 border-2 border-black text-[12px] md:text-[14px]">
            Mudar plano
            <MdAttachMoney className="w-4 h-4 lg:w-5 lg:h-5 text-gray-100" />
          </button> */}
          <button
            className="flex items-center justify-between text-red-300 py-2 px-4  rounded-md border-2 border-red-500 text-[12px] md:text-[14px]"
            onClick={onDelete}
          >
            Remover empresa
            <MdDelete className="w-4 h-4 lg:w-5 lg:h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
