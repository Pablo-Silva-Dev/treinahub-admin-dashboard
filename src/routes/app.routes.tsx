import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { lazy, ReactNode, Suspense } from "react";

const ErrorPage = lazy(() => import("@/screens/error"));
const NotFound = lazy(() => import("@/screens/404"));
const ConsultCertificates = lazy(
  () => import("@/screens/app/ConsultCertificates")
);
const FollowUserProgress = lazy(
  () => import("@/screens/app/FollowUserProgress")
);
const Home = lazy(() => import("@/screens/app/Home"));
const DashboardLayout = lazy(() => import("@/screens/app/layout"));
const ManageClasses = lazy(() => import("@/screens/app/ManageClasses"));
const ManageCompany = lazy(() => import("@/screens/app/ManageCompany"));
const ManageFaqQuestions = lazy(
  () => import("@/screens/app/ManageFaqQuestions")
);
const ManageQuestionsAndOptions = lazy(
  () => import("@/screens/app/ManageQuestionsAndOptions")
);
const ManageQuizzes = lazy(() => import("@/screens/app/ManageQuizzes"));
const ManageSupportContact = lazy(
  () => import("@/screens/app/ManageSupportContact")
);
const ManageTrainings = lazy(() => import("@/screens/app/ManageTrainings"));
const ManageUsers = lazy(() => import("@/screens/app/ManageUsers"));
const RegisterClass = lazy(() => import("@/screens/app/RegisterClass"));
const RegisterContactSupport = lazy(
  () => import("@/screens/app/RegisterContactSupport")
);
const RegisterFaqQuestion = lazy(
  () => import("@/screens/app/RegisterFaqQuestion")
);
const RegisterQuestionOption = lazy(
  () => import("@/screens/app/RegisterQuestionOption")
);
const RegisterQuiz = lazy(() => import("@/screens/app/RegisterQuiz"));
const RegisterQuizQuestion = lazy(
  () => import("@/screens/app/RegisterQuizQuestion")
);
const RegisterTraining = lazy(() => import("@/screens/app/RegisterTraining"));

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
    path: "/dashboard/gerenciar-dados-da-empresa",
    element: <ManageCompany />,
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
    path: "/dashboard/cadastrar-questionario",
    element: <RegisterQuiz />,
  },
  {
    path: "/dashboard/gerenciar-questionarios",
    element: <ManageQuizzes />,
  },
  {
    path: "/dashboard/cadastrar-pergunta",
    element: <RegisterQuizQuestion />,
  },
  {
    path: "/dashboard/cadastrar-resposta",
    element: <RegisterQuestionOption />,
  },
  {
    path: "/dashboard/gerenciar-perguntas-e-respostas",
    element: <ManageQuestionsAndOptions />,
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
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardLayout>{route.element}</DashboardLayout>
    </Suspense>
  ),
  errorElement: (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorPage />
    </Suspense>
  ),
}));

const appRouter = createBrowserRouter(appRoutes);

const AppRouter: React.FC = () => {
  return <RouterProvider router={appRouter} />;
};

export default AppRouter;
