import dashboard_background from "@/assets/dashboard_background.webp";
import logo_text from "@/assets/logo_text.svg";
import logo_text_dark from "@/assets/logo_text_dark.svg";
import { useThemeStore } from "@/store/theme";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface AuthenticationLayoutProps {
  children: ReactNode;
}

const AuthenticationLayout: React.FC<AuthenticationLayoutProps> = ({
  children,
}: AuthenticationLayoutProps) => {
  const { theme } = useThemeStore();

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
      <Toaster />
      <section className="flex flex-col lg w-full lg:w-2/3 bg-white dark:bg-slate-900  p-10 lg:p-20">
        <div className="flex flex-col justify-between h-full">
          {children}
          <div className="flex flex-col w-full items-center">
            <img
              src={theme === "dark" ? logo_text_dark : logo_text}
              alt="logo_text"
              width={200}
              height={120}
            />
          </div>
        </div>
      </section>
      <section className="flex flex-col w-full lg:w-1/3 ">
        <div className="bg-gradient-to-r from-secondary-light to-secondary-dark p-2 md:p-4 pl-8">
          <div className="w-[80%]">
            <span className="text-white text-lg md:text-2xl max-w-xs md:max-w-lg font-regular">
              Gerencie seus treinamentos de maneira{" "}
            </span>
            <span className="text-white text-lg md:text-2xl max-w-xs md:max-w-lg font-semibold">
              {" "}
              simples e otimizada
            </span>
          </div>
        </div>
        <img
          src={dashboard_background}
          alt="logo_text"
          className="w-full h-[33vh] lg:h-full object-cover brightness-[80%]"
        />
      </section>
    </div>
  );
};

export default AuthenticationLayout;
