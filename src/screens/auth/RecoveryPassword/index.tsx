import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { showAlertError } from "@/utils/alerts";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeInputCard from "./components/CodeInputCard";
import RecoveryPasswordForm, {
  RecoveryPasswordInputs,
} from "./components/RecoveryPasswordForm";

export function RecoveryPassword() {
  const RESEND_CODE_TIMER = 60;

  const [wasCodeSent, setWasCodeSent] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);
  const [code, setCode] = useState("");
  const [apiCode, setApiCode] = useState("");
  const [resendCodeTimer, setResendCodeTimer] = useState(RESEND_CODE_TIMER);
  const [ableToResendCode, setAbleToResendCode] = useState(false);
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const { isLoading, setIsLoading } = useLoading();
  const usersRepository = new UsersRepositories();

  const handleSendConfirmationCode = useCallback(
    async (data: RecoveryPasswordInputs) => {
      try {
        setIsLoading(true);
        setEmail(data.email);
        setCpf(data.cpf);

        const user = await usersRepository.getUserByEmail(data.email);

        if (user) {
          setUserId(user.id as never);
        }

        const recoveryCode =
          await usersRepository.getRecoveryPasswordCodeByEmail(data);
        if (recoveryCode) {
          setWasCodeSent(true);
          setApiCode(recoveryCode);
        }
      } catch (error) {
        if (typeof error === "object" && error !== null && "STATUS" in error) {
          const typedError = error as { STATUS: number };
          if (typedError.STATUS === 404) {
            showAlertError("Usuário não encontrado");
          }
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleResendCode = async (data: RecoveryPasswordInputs) => {
    await handleSendConfirmationCode(data);
    setAbleToResendCode(false);
    setResendCodeTimer(RESEND_CODE_TIMER);
  };

  const checkCode = useCallback(() => {
    if (wasCodeSent && code === apiCode) {
      setIsCodeValid(true);
    } else {
      setIsCodeValid(false);
    }
  }, [code]);

  useEffect(() => {
    checkCode();
  }, [checkCode, isCodeValid]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (resendCodeTimer <= 60 && resendCodeTimer >= 1) {
        setResendCodeTimer(resendCodeTimer - 1);
      } else {
        setResendCodeTimer(0);
        setAbleToResendCode(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCodeTimer]);

  useEffect(() => {
    if (isCodeValid) {
      navigate("/redefinir-senha", {
        state: userId,
      });
    }
  }, [isCodeValid, navigate]);

  return (
    <div className="flex flex-col lg:mt-[8vh] mt-[4vh]">
      <div className="flex flex-row mb-2 w-full sm:w-[400px] ml-8 sm:mx-auto">
        <HeaderNavigation screenTitle="Recuperação de senha" />
      </div>
      {wasCodeSent ? (
        <CodeInputCard
          code={code}
          cpf={cpf}
          onChangeCode={(val) => setCode(val)}
          email="johndoe@gmail.com"
          isInvalidCode={wasCodeSent && !isCodeValid}
          onResendCode={() => handleResendCode({ email, cpf })}
          timeToResendCode={resendCodeTimer}
          ableToResendCode={ableToResendCode}
        />
      ) : (
        <RecoveryPasswordForm
          onSubmit={handleSendConfirmationCode}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
