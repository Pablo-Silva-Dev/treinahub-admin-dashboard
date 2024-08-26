import ReactLoading, { LoadingType } from "react-loading";

interface LoadingProps {
  type?: LoadingType;
  color?: string;
  text?: string;
  hideText?: boolean;
}

export function Loading({ type, color, text, hideText }: LoadingProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ReactLoading
        type={type ? type : "spin"}
        color={color ? color : "#FFFFFF"}
        width={24}
        height={24}
      />
      {!hideText && (
        <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-secondary mt-2">
          {text ? text : "Carregando dados..."}
        </span>
      )}
    </div>
  );
}
