import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { UsersRepositories } from "@/repositories/usersRepositories";
import { useLoading } from "@/store/loading";
import { showAlertError } from "@/utils/alerts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CodeInputCard from "./components/CodeInputCard";
import RecoveryPasswordByEmailForm, {
  RecoveryPasswordByEmailInputs,
} from "./components/RecoveryPasswordByEmailForm";
import RecoveryPasswordBySMSForm, {
  RecoveryPasswordBySMSInputs,
} from "./components/RecoveryPasswordBySMS";

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
  const [phone, setPhone] = useState("");
  const [userId, setUserId] = useState("");
  const [formType, setFormType] = useState<"email" | "sms">("email");

  const navigate = useNavigate();

  const { isLoading, setIsLoading } = useLoading();
  const usersRepository = useMemo(() => {
    return new UsersRepositories();
  }, []);

  const handleSendConfirmationCodeByEmail = useCallback(
    async (data: RecoveryPasswordByEmailInputs) => {
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
    [setIsLoading, usersRepository]
  );

  const handleSendConfirmationCodeBySMS = useCallback(
    async (data: RecoveryPasswordBySMSInputs) => {
      try {
        setIsLoading(true);
        setPhone(data.phone);

        const user = await usersRepository.getUserByPhone(data.phone);

        if (user) {
          setUserId(user.id as never);
        }

        const recoveryCode =
          await usersRepository.getRecoveryPasswordCodeBySMS(data);
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
    [setIsLoading, usersRepository]
  );

  const handleResendCode = async (
    data: RecoveryPasswordByEmailInputs | RecoveryPasswordBySMSInputs,
    communicationType: "email" | "sms"
  ) => {
    if (communicationType === "email") {
      await handleSendConfirmationCodeByEmail(
        data as RecoveryPasswordByEmailInputs
      );
      setAbleToResendCode(false);
      setResendCodeTimer(RESEND_CODE_TIMER);
    } else {
      await handleSendConfirmationCodeBySMS(
        data as RecoveryPasswordBySMSInputs
      );
      setAbleToResendCode(false);
      setResendCodeTimer(RESEND_CODE_TIMER);
    }
  };

  const checkCode = useCallback(() => {
    if (wasCodeSent && code === apiCode) {
      setIsCodeValid(true);
    } else {
      setIsCodeValid(false);
    }
  }, [apiCode, code, wasCodeSent]);

  const handleChangeFormType = (formType: "email" | "sms") => {
    if (formType !== "email") {
      setFormType("sms");
    } else {
      setFormType("email");
    }
  };

  function renderFormType() {
    if (formType === "email") {
      return (
        <RecoveryPasswordByEmailForm
          onSubmit={handleSendConfirmationCodeByEmail}
          onReceiveCodeBySMS={() => handleChangeFormType("sms")}
          isLoading={isLoading}
        />
      );
    } else {
      return (
        <RecoveryPasswordBySMSForm
          onSubmit={handleSendConfirmationCodeBySMS}
          onReceiveCodeByEmail={() => handleChangeFormType("email")}
          isLoading={isLoading}
        />
      );
    }
  }

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
  }, [isCodeValid, navigate, userId]);

  return (
    <div className="flex flex-col lg:mt-[8vh] mt-[4vh]">
      <div className="flex flex-row mb-2 w-full sm:w-[400px] ml-8 sm:mx-auto">
        <HeaderNavigation screenTitle="Recuperação de senha" />
      </div>
      <div className="flex flex-row mt-4 ml-1 w-full max-w-[400px] mx-auto bg-red-200 place-self-center"></div>
      {wasCodeSent ? (
        <CodeInputCard
          code={code}
          cpf={cpf}
          phone={phone}
          onChangeCode={(val) => setCode(val)}
          email={email}
          isInvalidCode={wasCodeSent && !isCodeValid}
          onResendCodeByEmail={() => handleResendCode({ email, cpf }, formType)}
          onResendCodeBySMS={() => handleResendCode({ phone }, formType)}
          formType={formType}
          timeToResendCode={resendCodeTimer}
          ableToResendCode={ableToResendCode}
        />
      ) : (
        renderFormType()
      )}
    </div>
  );
}
