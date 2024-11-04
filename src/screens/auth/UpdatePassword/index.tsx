import { NAVIGATION_TIMER } from "@/appConstants/index";
import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { useCallback, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UpdatePasswordForm,
  UpdatePasswordInputs,
} from "./components/UpdatePasswordForm";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const usersRepositories = useMemo(() => {
    return new UsersRepositories();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useLoading();

  const userId = location.state;

  const handleUpdatePassword = useCallback(
    async (data: UpdatePasswordInputs) => {
      try {
        setIsLoading(true);
        const response = await usersRepositories.updateUser(data);
        if (response.id) {
          showAlertSuccess("Senha alterada com sucesso!");
          setTimeout(() => {
            navigate("/");
          }, NAVIGATION_TIMER);
        }
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          const typedError = error as { STATUS: number };
          if (typedError.STATUS === 404) {
            showAlertError("Usuário não encontrado");
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setIsLoading, usersRepositories]
  );

  return (
    <div className="flex flex-col lg:mt-[8vh] mt-[4vh]">
      <div className="flex flex-row mb-2 w-full sm:w-[400px] ml-8 sm:mx-auto">
        <HeaderNavigation screenTitle="Redefinição de senha" />
      </div>
      <UpdatePasswordForm
        passwordConfirmation={passwordConfirmation}
        setPasswordConfirmation={setPasswordConfirmation}
        userId={userId}
        password={password}
        setPassword={setPassword}
        onSubmit={handleUpdatePassword}
        isLoading={isLoading}
      />
    </div>
  );
}
