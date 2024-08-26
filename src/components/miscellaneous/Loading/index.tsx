import ReactLoading, { LoadingType } from "react-loading";

interface LoadingProps {
  type?: LoadingType;
  color?: string;
  text?: string;
}

export function Loading({ type, color, text }: LoadingProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ReactLoading
        type={type ? type : "spin"}
        color={color ? color : "#FFFFFF"}
        width={24}
        height={24}
      />
      <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-secondary mt-2">
        {text ? text : "Carregando dados..."}
      </span>
    </div>
  );
}
