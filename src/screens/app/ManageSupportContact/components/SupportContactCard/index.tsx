import { unformatPhoneNumber } from "@/utils/formats";
import { MdDelete, MdEdit, MdPerson, MdWhatsapp } from "react-icons/md";

interface ContactSupportCardProps {
  name: string;
  contactNumber: string;
  onEditContact: () => void;
  onDeleteContact: () => void;
}

export function ContactSupportCard({
  name,
  contactNumber,
  onDeleteContact,
  onEditContact,
}: ContactSupportCardProps) {
  return (
    <div className="flex flex-row p-4 rounded-md mb-4 bg-gray-50 dark:bg-slate-700 shadow-md items-center justify-between">
      <div className="flex flex-row">
        <MdPerson className="h-4 w-4 md:h-6 md:w-6 mr-2  text-gray-800 dark:text-gray-200" />
        <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 mr-4">
          {name}
        </span>
        <MdWhatsapp className="h-4 w-4 md:h-6 md:w-6 mr-2  text-green-500" />
        <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 mr-10">
          {unformatPhoneNumber(contactNumber)}
        </span>
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
