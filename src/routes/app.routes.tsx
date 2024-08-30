import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { NotFound } from "@/screens/404";
import { ConsultCertificates } from "@/screens/app/ConsultCertificates";
import { FollowUserProgress } from "@/screens/app/FollowUserProgress";
import { Home } from "@/screens/app/Home";
import { DashboardLayout } from "@/screens/app/layout";
import { ManageClasses } from "@/screens/app/ManageClasses";
import { ManageFaqQuestions } from "@/screens/app/ManageFaqQuestions";
import { ManageSupportContact } from "@/screens/app/ManageSupportContact";
import { ManageTrainings } from "@/screens/app/ManageTrainings";
import { ManageUsers } from "@/screens/app/ManageUsers";
import { RegisterClass } from "@/screens/app/RegisterClass";
import { RegisterContactSupport } from "@/screens/app/RegisterContactSupport";
import { RegisterFaqQuestion } from "@/screens/app/RegisterFaqQuestion";
import { RegisterTraining } from "@/screens/app/RegisterTraining";
import { ErrorPage } from "@/screens/error";
import { ReactNode } from "react";

type route = {
  path: string;
  element: ReactNode;
};

const appRoutesBase: route[] = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Home />,
  },
  {
    path: "/dashboard/gerenciar-usuarios",
    element: <ManageUsers />,
  },
  {
    path: "/dashboard/cadastrar-treinamento",
    element: <RegisterTraining />,
  },
  {
    path: "/dashboard/gerenciar-treinamentos",
    element: <ManageTrainings />,
  },
  {
    path: "/dashboard/cadastrar-videoaula",
    element: <RegisterClass />,
  },
  {
    path: "/dashboard/cadastrar-pergunta-frequente",
    element: <RegisterFaqQuestion />,
  },
  {
    path: "/dashboard/gerenciar-perguntas-frequentes",
    element: <ManageFaqQuestions />,
  },
  {
    path: "/dashboard/cadastrar-contato-de-suporte",
    element: <RegisterContactSupport />,
  },
  {
    path: "/dashboard/gerenciar-contatos-de-suporte",
    element: <ManageSupportContact />,
  },
  {
    path: "/dashboard/gerenciar-videoaulas",
    element: <ManageClasses />,
  },
  {
    path: "/dashboard/consultar-certificados",
    element: <ConsultCertificates />,
  },
  {
    path: "/dashboard/acompanhar-progresso-do-usuario",
    element: <FollowUserProgress />,
  },
];

const appRoutes = appRoutesBase.map((route) => ({
  path: route.path,
  element: <DashboardLayout>{route.element}</DashboardLayout>,
  errorElement: <ErrorPage />,
}));

const appRouter = createBrowserRouter(appRoutes);

const AppRouter: React.FC = () => {
  return <RouterProvider router={appRouter} />;
};

export default AppRouter;
