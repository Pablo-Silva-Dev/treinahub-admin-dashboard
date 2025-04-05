import FeatherIcon from "feather-icons-react";

interface RegistrationInfoProps {
  registration: string;
  infoText: string;
  iconName: string;
  infoTextSecondary?: string;
}

export function RegistrationInfo({
  iconName,
  infoText,
  registration,
  infoTextSecondary,
}: RegistrationInfoProps) {
  return (
    <div className="w-[90%] xl:w-[15vw] h-full flex flex-col justify-evenly items-center bg-white dark:bg-slate-700 p-4 rounded-md mb-4">
      <h1 className="text-center text-black dark:text-white text-lg md:text-xl font-bold font-secondary">
        {registration}
      </h1>
      <div className="w-full my-4 flex justify-center">
        <FeatherIcon
          icon={iconName}
          className="text-gray-700 dark:text-gray-100 w-7 h-7 md:w-32 lg:h-32"
          strokeWidth={1}
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center">
        <span className="text-black dark:text-white lg:text-base md:text-sm text-[12px] text-center">
          {infoText}
        </span>
        {infoTextSecondary && (
          <span className="text-black dark:text-white lg:text-base md:text-sm text-[12px] text-center mt-4">
            {infoTextSecondary}
          </span>
        )}
      </div>
    </div>
  );
}
