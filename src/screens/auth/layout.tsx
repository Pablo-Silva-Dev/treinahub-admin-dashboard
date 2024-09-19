import dashboard_background from "@/assets/dashboard_background.webp";
import logo_text from "@/assets/logo_text.svg";
import { CompanyFooterLink } from "@/components/miscellaneous/CompanyFooterLink";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface AuthenticationLayoutProps {
  children: ReactNode;
}

export const AuthenticationLayout: React.FC<AuthenticationLayoutProps> = ({
  children,
}: AuthenticationLayoutProps) => {
  return (
    <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen">
      <Toaster />
      <section className="flex flex-col lg w-full lg:w-1/2 bg-white dark:bg-slate-900  p-10 lg:p-20">
        <div className="flex flex-col justify-between h-full">
          {children}
          <div className="flex flex-col w-full items-center">
            <img src={logo_text} alt="logo_text" width={200} height={120} />
            <div className="flex flex-col lg:flex-row w-full mt-6 mb-2 justify-center">
              <CompanyFooterLink
                companyText="Desenvolvido por PS Code. Acesse nosso site "
                companyLink="https://www.pablosilvadev.com.br"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col w-full lg:w-1/2 ">
        <div className="bg-gradient-to-r from-secondary-light to-secondary-dark p-2 md:p-4 pl-8">
          <div className="w-[80%]">
            <span className="text-white text-lg md:text-3xl max-w-xs md:max-w-lg font-thin">
              Gerencie seus treinamentos de maneira{" "}
            </span>
            <span className="text-white text-lg md:text-3xl max-w-xs md:max-w-lg font-bold">
              {" "}
              simples e otimizada
            </span>
          </div>
        </div>
        <img
          src={dashboard_background}
          alt="logo_text"
          className="w-full h-full object-cover"
        />
      </section>
    </div>
  );
};
