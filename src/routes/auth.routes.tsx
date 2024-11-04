import { Loading } from "@/components/miscellaneous/Loading";
import { lazy, ReactNode, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const NotFound = lazy(() => import("@/screens/404"));
const ErrorPage = lazy(() => import("@/screens/error"));
const InitialScreen = lazy(() => import("@/screens/auth/InitialScreen"));
const AuthenticationLayout = lazy(() => import("@/screens/auth/layout"));
const RecoveryPassword = lazy(() => import("@/screens/auth/RecoveryPassword"));
const SignUp = lazy(() => import("@/screens/auth/SignUp"));
const UpdatePassword = lazy(() => import("@/screens/auth/UpdatePassword"));

type route = {
  path: string;
  element: ReactNode;
};

const authRoutesBase: route[] = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <InitialScreen />,
  },
  {
    path: "/cadastro",
    element: <SignUp />,
  },
  {
    path: "/recuperar-senha",
    element: <RecoveryPassword />,
  },
  {
    path: "/redefinir-senha",
    element: <UpdatePassword />,
  },
];

const LoadingFallback = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loading />
    </div>
  );
};

const authRoutes = authRoutesBase.map((route) => ({
  path: route.path,
  element: (
    <Suspense fallback={<LoadingFallback />}>
      <AuthenticationLayout>{route.element}</AuthenticationLayout>
    </Suspense>
  ),
  errorElement: (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorPage />
    </Suspense>
  ),
}));

const authRouter = createBrowserRouter(authRoutes);

const AuthRouter: React.FC = () => {
  return <RouterProvider router={authRouter} />;
};

export default AuthRouter;
