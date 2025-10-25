import logo from "@/assets/logo.svg";
import logo_text from "@/assets/logo_text.svg";
import logo_text_dark from "@/assets/logo_text_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { menuItems } from "@/data/dashboardMenu";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useAuthenticationStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import "@/styles/globals.css";
import {
  reactMobileMenuModalCustomStyles,
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { showAlertError } from "@/utils/alerts";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Breadcrumbs,
  Button,
} from "@material-tailwind/react";
import FeatherIcon from "feather-icons-react";
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Toaster } from "react-hot-toast";
import {
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdLogout,
  MdMenu,
} from "react-icons/md";
import Modal from "react-modal";
import { Link, useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
interface DashboardLayoutProps {
  children: ReactNode;
}

interface LoadingBarProps {
  staticStart: () => void;
  complete: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}: DashboardLayoutProps) => {
  const [pathSegments, setPathSegments] = useState({ base: "", action: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split("/");
      setPathSegments({
        base: segments[1] || "",
        action: segments[2] || "",
      });
    }
  }, []);

  const usersRepository = useMemo(() => {
    return new UsersRepositories();
  }, []);

  const { base, action } = pathSegments;

  const [openedAccordionIndexes, setOpenedAccordionIndexes] = useState<
    number[]
  >([]);

  const [breadCrumbBase, setBreadCrumbBase] = useState(base);
  const [breadCrumbAction, setBreadCrumbAction] = useState(action);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileMenuModalOpen, setIsMobileMenuModalOpen] = useState(false);
  const [company, setCompany] = useState<ICompanyDTO | null>(null);
  const [internalLoading, setInternalLoading] = useState(false);

  const { signOut, user } = useAuthenticationStore();

  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();

  const ref = useRef<LoadingBarProps>(null);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompanyStorage = useCallback(async () => {
    try {
      setInternalLoading(true);
      const company = await companiesRepository.getCompany(user.companyId);
      if (company) {
        setCompany(company);
      }
    } catch (error) {
      console.log("Error at trying to get company storage: ", error);
    } finally {
      setInternalLoading(false);
    }
  }, [companiesRepository, user.companyId]);

  useEffect(() => {
    getCompanyStorage();
  }, [getCompanyStorage]);

  const handleOpenedAccordionIndexes = (idx: number) => {
    const filteredAccordionIndexes = openedAccordionIndexes.filter(
      (index) => index !== idx
    );

    if (openedAccordionIndexes.includes(idx)) {
      setOpenedAccordionIndexes(filteredAccordionIndexes);
    } else {
      setOpenedAccordionIndexes([...openedAccordionIndexes, idx]);
    }
  };

  const updateBreadcrumbs = useCallback(() => {
    if (typeof window !== "undefined") {
      const segments = window.location.pathname.split("/");
      setBreadCrumbBase(segments[1] || "");
      setBreadCrumbAction(segments[2] || "");
    }
  }, []);

  const handleToggleLogoutModal = () => {
    setIsLogoutModalOpen(!isLogoutModalOpen);
  };

  const handleToggleMobileMenuModal = () => {
    setIsMobileMenuModalOpen(!isMobileMenuModalOpen);
  };

  useEffect(() => {
    window.addEventListener("popstate", updateBreadcrumbs);

    const pushState = window.history.pushState;
    const replaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      pushState.apply(window.history, args);
      updateBreadcrumbs();
    };

    window.history.replaceState = function (...args) {
      replaceState.apply(window.history, args);
      updateBreadcrumbs();
    };

    return () => {
      window.removeEventListener("popstate", updateBreadcrumbs);
    };
  }, [updateBreadcrumbs]);

  const unAuthenticateUser = useCallback(async () => {
    try {
      await usersRepository.unAuthenticateUser({ email: user.email });
    } catch (error) {
      showAlertError("Erro ao sair da conta.");
    }
  }, [user.email, usersRepository]);

  const handleSignOut = async () => {
    await unAuthenticateUser();
    signOut();
    navigate("/");
  };

  useEffect(() => {
    setIsMobileMenuModalOpen(false);
  }, [breadCrumbBase, breadCrumbAction]);

  useEffect(() => {
    if (ref.current) {
      ref.current.staticStart();
      ref.current.complete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <section className="flex flex-col h-screen overflow-hidden">
      <LoadingBar ref={ref as never} height={4} color="#0267FF" />
      <Toaster />
      {internalLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-row w-full min-h-screen">
          <nav className="hidden xl:flex flex-col w-[320px] min-h-screen overflow-auto p-8 px-4 bg-white dark:bg-slate-900 items-start">
            <Link to="/dashboard">
              <img
                src={theme === "dark" ? logo_text_dark : logo_text}
                alt="logo-text"
                width={200}
                className="mb-2 pl-6"
              />
            </Link>
            {menuItems.map((item, idx) => (
              <Accordion
                className="flex flex-col"
                open={openedAccordionIndexes.includes(idx)}
                key={item.title}
              >
                <AccordionHeader
                  className="flex justify-start border-none mb-[-24px]"
                  onClick={() => handleOpenedAccordionIndexes(idx)}
                >
                  <Button
                    className={`bg-transparent hover:shadow-none shadow-none w-full flex flex-row items-center text-[12px] lg:text-[14px] text-black dark:text-white font-secondary hover:bg-transparent focus:bg-transparent rounded-none no-ripple-effect`}
                    ripple={false}
                  >
                    <FeatherIcon
                      icon={item.icon}
                      size={28}
                      className="text-black dark:text-white mr-2"
                      strokeWidth={1}
                    />
                    {item.title}
                  </Button>
                </AccordionHeader>
                <AccordionBody className="flex flex-col py-0 px-4">
                  {item.actions.map((action) => (
                    <Link
                      to={"/dashboard/" + action.link}
                      key={action.title}
                      className={`mb-1 p-0 text-[13px] font-bold text-black dark:text-white hover:bg-transparent`}
                    >
                      <Button
                        className={`bg-transparent hover:shadow-none shadow-none flex p-1 pl-2 ml-4 w-full text-[10px] lg:text-[11px] text-gray-700 dark:text-gray-300 font-secondary font-medium hover:bg-transparent focus:bg-transparent focus:border-l-[4px] text-left focus:border-l-primary rounded-none no-ripple-effect focus:font-bold `}
                        ripple={false}
                      >
                        {action.title}
                      </Button>
                    </Link>
                  ))}
                </AccordionBody>
              </Accordion>
            ))}
          </nav>
          <div className="flex flex-1 flex-col justify-between pb-0 bg-gray-100 dark:bg-slate-800 h-screen w-full overflow-y-auto">
            <header
              className={
                !isMobileMenuModalOpen
                  ? "w-full flex flex-row justify-between items-center border-bottom-2 lg:p-4 p-3 fixed bg-gray-50 dark:bg-slate-700 border-b-gray-200 dark:border-b-slate-600 border-b-2 z-50"
                  : "w-full flex flex-row justify-between items-center border-bottom-2 mb-[400px] lg:p-4 p-3 fixed bg-gray-50 dark:bg-slate-700 border-b-gray-200 dark:border-b-slate-600 border-b-2"
              }
            >
              <div className="flex flex-row items-center">
                <Link to="/dashboard">
                  <img
                    src={logo}
                    alt="logo-text"
                    width={40}
                    className="block md:hidden"
                  />
                </Link>
                <div className="hidden lg:flex mr-4">
                  <Breadcrumbs className="ml-4 bg-gray-200 dark:bg-slate-800">
                    <Link to="/dashboard">
                      <span className="text-[12px] lx:text-sm hidden sm:flex dark:text-gray-100 text-slate-800">
                        {breadCrumbBase}
                      </span>
                    </Link>
                    <Link to={`/dashboard/${breadCrumbAction}`}>
                      <span className="opacity-60 text-[12px] lx:text-sm dark:text-gray-100 text-slate-800">
                        {breadCrumbAction}
                      </span>
                    </Link>
                  </Breadcrumbs>
                </div>
                <div className="flex xl:hidden mx-auto">
                  <button onClick={handleToggleMobileMenuModal}>
                    <MdMenu className="w-7 h-7 text-primary dark:text-primary-light ml-3" />
                  </button>
                </div>
              </div>
              <div className="flex flex-row items-center lg:mr-[320px] ml-8">
                <button onClick={toggleTheme}>
                  {theme === "light" ? (
                    <MdDarkMode className="h-5 w-5  text-slate-800 dark:text-gray-100 mr-4 sm:mr-8" />
                  ) : (
                    <MdLightMode className="h-5 w-5 text-slate-800 dark:text-gray-100 mr-4 sm:mr-8" />
                  )}
                </button>
                <div className="flex flex-row items-center justify-center rounded-lg bg-gradient-to-r from-secondary-light to-secondary-dark p-2">
                  <span className="text-[12px] lg:text-[14px] text-white  font-secondary">
                    Administrador
                  </span>
                </div>
                <button
                  className="flex flex-row justify-between items-center p-2 ml-3"
                  onClick={handleToggleLogoutModal}
                >
                  <span className="text-[12px] lx:text-sm normal-case text-secondary-dark dark:text-secondary-light">
                    Sair
                  </span>
                  <MdLogout className="w-5 h-5 ml-1 text-secondary-dark dark:text-secondary-light" />
                </button>
              </div>
            </header>
            <div className="mt-[96px]">{children}</div>
          </div>
        </div>
      )}
      <Modal
        isOpen={isLogoutModalOpen}
        style={
          theme === "light"
            ? reactModalCustomStyles
            : reactModalCustomStylesDark
        }
        onRequestClose={handleToggleLogoutModal as never}
      >
        <Title
          content="Você está deixando a plataforma"
          className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-[16px]"
        />
        <Subtitle
          content="Deseja realmente sair da plataforma?"
          className="text-center text-gray-700 dark:text-gray-100 mb-6  text-[13px] md:text-[14px]"
        />
        <div className="flex flex-col md:flex-row items-center justify-around w-full md:w-[480px]">
          <button
            onClick={handleToggleLogoutModal}
            className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 px-4 py-2 rounded-lg text-sm w-[188px]"
          >
            Continuar na plataforma
          </button>
          <button
            onClick={handleSignOut}
            className="text-white text-sm bg-red-500 px-4 py-2 rounded-lg w-[188px] mt-4 md:mt-0"
          >
            Sair da plataforma
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={isMobileMenuModalOpen}
        style={reactMobileMenuModalCustomStyles}
        onRequestClose={handleToggleMobileMenuModal as never}
      >
        <nav className="flex flex-col w-full h-screen overflow-auto p-4 bg-white dark:bg-slate-900 items-start overflow-x-hidden ">
          <div className="w-full flex flew-row justify-end mr-4 mb-[-16px] mt-1">
            <button
              className="p-1 bg-transparent"
              onClick={handleToggleMobileMenuModal}
            >
              <MdClose className="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>
          <Link to="/dashboard">
            <img
              src={theme === "dark" ? logo_text_dark : logo_text}
              alt="logo-text"
              width={200}
              className="mb-2 pl-4"
            />
          </Link>
          {menuItems.map((item, idx) => (
            <Accordion
              className="flex flex-col"
              open={openedAccordionIndexes.includes(idx)}
              key={item.title}
            >
              <AccordionHeader
                className="flex justify-start border-none mb-[-24px]"
                onClick={() => handleOpenedAccordionIndexes(idx)}
              >
                <Button
                  className={`bg-transparent hover:shadow-none shadow-none w-full flex flex-row items-center text-b text-black dark:text-white font-secondary hover:bg-transparent focus:bg-transparent rounded-none no-ripple-effect`}
                  ripple={false}
                >
                  <FeatherIcon
                    icon={item.icon}
                    size={28}
                    className="text-black dark:text-white mr-2"
                    strokeWidth={1}
                  />
                  {item.title}
                </Button>
              </AccordionHeader>
              <AccordionBody className="flex flex-col py-0 px-4">
                {item.actions.map((action) => (
                  <Link
                    to={"/dashboard/" + action.link}
                    key={action.title}
                    className={`mb-1 p-0 text-[13px] font-bold text-black dark:text-white hover:bg-transparent`}
                  >
                    <Button
                      className={`bg-transparent hover:shadow-none shadow-none flex p-1 pl-2 ml-4 w-full text-[11px] lg:text-[12px] text-gray-700 dark:text-gray-300 font-secondary font-medium hover:bg-transparent focus:bg-transparent focus:border-l-[4px] text-left focus:border-l-primary rounded-none no-ripple-effect focus:font-bold `}
                      ripple={false}
                    >
                      {action.title}
                    </Button>
                  </Link>
                ))}
              </AccordionBody>
            </Accordion>
          ))}
        </nav>
      </Modal>
    </section>
  );
};

export default DashboardLayout;
