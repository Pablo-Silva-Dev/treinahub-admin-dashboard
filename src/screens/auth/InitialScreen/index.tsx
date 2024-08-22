import { Title } from "@/components/typography/Title";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useAuthenticationStore } from "@/store/auth";
import { showAlertError } from "@/utils/alerts";
import { jwtDecode } from "jwt-decode";
import { SignInForm, SignInFormInputs } from "./components/SignInForm";

interface IJwtPayload {
  isAdmin: boolean;
}

export function InitialScreen() {
  const { signIn } = useAuthenticationStore();

  const handleSignIn = async (data: SignInFormInputs) => {
    try {
      const usersRepository = new UsersRepositories();
      const user = await usersRepository.authenticateUser(data);
      const jwtPayload: IJwtPayload = jwtDecode(user.token);
      if (jwtPayload.isAdmin) {
        signIn(user);
      } else {
        showAlertError("Somente administradores têm acesso à plataforma.");
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        const typedError = error as { STATUS: number };
        if (typedError.STATUS === 409)
          showAlertError("Credenciais incorretas.");
        console.log(error);
      }
    }
  };

  return (
    <div className="flex flex-col lg:mt-[16vh] items-center lg:mb-2 mb-8">
      <Title
        content="Entrar na plataforma"
        className="text-black dark:text-white mb-6 text-xl font-bold md:text-3xl font-secondary"
      />
      <SignInForm onSubmit={handleSignIn} />
    </div>
  );
}
