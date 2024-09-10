import { unformatPhoneNumber } from "@/utils/formats";
import {
  MdDelete,
  MdEdit,
  MdEmail,
  MdPerson,
  MdWhatsapp,
} from "react-icons/md";

interface ContactSupportCardProps {
  name: string;
  contactNumber: string;
  email: string;
  onEditContact: () => void;
  onDeleteContact: () => void;
  hideContactNumber: boolean;
}

export function ContactSupportCard({
  name,
  contactNumber,
  onDeleteContact,
  onEditContact,
  email,
  hideContactNumber,
}: ContactSupportCardProps) {
  return (
    <div className="flex flex-row p-4 rounded-md mb-4 bg-gray-50 dark:bg-slate-700 shadow-md items-center justify-between w-full">
      <div className="flex flex-col md:flex-row md:items-center">
        <div className="mb-3 md:mb-0 flex flex-row">
          <MdPerson className="h-4 w-4 md:h-6 md:w-6 mr-2  text-gray-800 dark:text-gray-200" />
          <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 mr-4">
            {name}
          </span>
        </div>
        <div className="mb-3 md:mb-0 flex flex-row">
          <MdEmail className="h-4 w-4 md:h-6 md:w-6 mr-2  text-gray-800 dark:text-gray-200" />
          <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 mr-10">
            {email}
          </span>
        </div>
        {!hideContactNumber && (
          <div className="mb-3 md:mb-0 flex flex-row">
            <MdWhatsapp className="h-4 w-4 md:h-6 md:w-6 mr-2 mb-2 md:mb-0 text-green-500" />
            <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 mr-10">
              {unformatPhoneNumber(contactNumber)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <button onClick={onEditContact}>
          <MdEdit className="h-4 w-4 md:h-5 md:w-5 mr-4  text-gray-800 dark:text-gray-200" />
        </button>
        <button onClick={onDeleteContact}>
          <MdDelete className="h-4 w-4 md:h-5 md:w-5 text-red-400 " />
        </button>
      </div>
    </div>
  );
}
