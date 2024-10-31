import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { MdAttachMoney, MdDelete, MdEdit } from "react-icons/md";

interface CompanyInfoCardProps {
  company: ICompanyDTO;
  onDelete: () => void;
  onUpdate?: () => void;
  onUpdatePlan?: () => void;
  onUpdateAvatar?: () => void;
}

export function CompanyInfoCard({ company, onDelete }: CompanyInfoCardProps) {
  return (
    <div className="w-full flex flex-col md:flex-row bg-white dark:bg-slate-700 p-4 rounded-md mb-2">
      <div className="w-full flex flex-col mb-4">
        <img
          src={company?.logo_url}
          alt="treinahub"
          className="w-[80px] rounded-md mb-2 aspect-square"
        />
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100 font-bold">
            Nome fantasia
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.fantasy_name}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100 font-bold  mb-2">
            Razão social
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.social_reason}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100  font-bold  mb-2">
            Email
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.email}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-[12px] md:text-[14px] text-gray-900 dark:text-gray-100  font-bold  mb-2">
            Telefone
          </span>
          <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
            {company.phone ?? "Não informado"}
          </span>
        </div>
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
          <button className="flex items-center justify-between bg-transparent text-gray-900 dark:text-gray-100 py-2 px-4 rounded-md mb-2 border-2 border-black dark:border-white text-[12px] md:text-[14px]">
            Alterar dados
            <MdEdit className="w-4 h-4 lg:w-5 lg:h-5 dark:text-gray-50" />
          </button>
          <button className="flex items-center justify-between bg-black text-gray-100 py-2 px-4 rounded-md mb-2 border-2 border-black text-[12px] md:text-[14px]">
            Mudar plano
            <MdAttachMoney className="w-4 h-4 lg:w-5 lg:h-5 text-gray-100" />
          </button>
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
