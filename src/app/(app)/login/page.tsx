"use client";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { RegisterProForm } from "@/components/forms/RegisterProForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/forms/LoginForm";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  REGISTER_PRO = "REGISTER_PRO",
  RESET_PASSWORD = "RESET_PASSWORD"
}

const LoginPage = () => {
  const params = useSearchParams()
  const modeParams = params.size === 0 || params.get("email") ? MODE.LOGIN : params.get('register') === "user" ? MODE.REGISTER : MODE.REGISTER_PRO;
  const [mode, setMode] = useState(modeParams);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "";
  useEffect(() => {
    setMode(modeParams);
  }, [params]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;
      switch (mode) {
        case MODE.RESET_PASSWORD:
          // response = await wixClient.auth.sendPasswordResetEmail(
          //   email,
          //   window.location.href
          // );
          setMessage("Password reset email sent. Please check your e-mail.");
          break;
  
      }

      // switch (response?.loginState) {
      //   case LoginState.SUCCESS:
      //     setMessage("Successful! You are being redirected.");
      //     const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
      //       response.data.sessionToken!
      //     );
      //
      //     Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
      //       expires: 2,
      //     });
      //     wixClient.auth.setTokens(tokens);
      //     router.push("/");
      //     break;
      //   case LoginState.FAILURE:
      //     if (
      //       response.errorCode === "invalidEmail" ||
      //       response.errorCode === "invalidPassword"
      //     ) {
      //       setError("Invalid email or password!");
      //     } else if (response.errorCode === "emailAlreadyExists") {
      //       setError("Email already exists!");
      //     } else if (response.errorCode === "resetPassword") {
      //       setError("You need to reset your password!");
      //     } else {
      //       setError("Something went wrong!");
      //     }
    
      //   case LoginState.OWNER_APPROVAL_REQUIRED:
      //     setMessage("Your account is pending approval");
      //   default:
      //     break;
      // }
    } catch (err) {
      console.log(err);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" min-h-[calc(100vh-64px-6rem)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="flex flex-col gap-8 justify-center items-center">
        <Image src="/logo.png" alt="" width={36} height={36} className="mt-8"/>
        {mode === MODE.LOGIN && (
            <>
              <LoginForm />
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <div className="text-center text-sm">
                  <p className="text-gray-600 mb-2">¿Todavía no estás registrado?</p>
                  <div
                    onClick={() => setMode(MODE.REGISTER)} className="w-full cursor-pointer block text-center px-6 py-3 bg-gray-100 text-euroestetic font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Registro
                  </div>
                </div>

                <div className="text-center text-sm">
                  <p className="text-gray-600 mb-2">¿Eres Profesional?</p>
                  <div
                    onClick={() => setMode(MODE.REGISTER_PRO)}
                    className="w-full cursor-pointer block text-center px-6 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Regístrate como profesional
                  </div>
                </div>

                
              </div>
              <div className="">
                  <div
                    className="text-sm text-euroestetic opacity-80 hover:opacity-50 px-2 cursor-pointer"
                    onClick={() => setMode(MODE.RESET_PASSWORD)}
                  >
                    ¿Has olvidado tu contraseña?
                  </div>
            
                </div>
            </>
          )
        }
        {(mode === MODE.REGISTER || mode === MODE.REGISTER_PRO) && (
          <>
            {mode === MODE.REGISTER ? (
                <RegisterForm />
            )
            : (
                <RegisterProForm />)
            }
            <div className="flex flex-wrap justify-center gap-4 w-full">
              <div className="text-sm text-center">
                <p className="text-gray-600 mb-2">¿Tienes ya una cuenta?</p>
              
                  <div
                    onClick={() => setMode(MODE.LOGIN)}
                    className="w-full cursor-pointer text-center px-6 py-3 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    Ir a Login
                  </div>
              </div>
              {mode === MODE.REGISTER ? (
                <div className="text-center text-sm">
                <p className="text-gray-600 mb-2">¿Eres Profesional?</p>
                <div
                  onClick={() => setMode(MODE.REGISTER_PRO)}
                  className="w-full cursor-pointer block text-center px-6 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Regístrate como profesional
                </div>
              </div>
              )
              : (
                <div className="text-center text-sm">
                <p className="text-gray-600 mb-2">¿Todavía no estás registrado?</p>
                <div
                  onClick={() => setMode(MODE.REGISTER)} className="w-full cursor-pointer block text-center px-6 py-3 bg-gray-100 text-euroestetic font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Registro
                </div>
              </div>
                )
              }
            </div>
            
          </>
          )
        }
        {mode === MODE.RESET_PASSWORD && (
            <div
              className="text-sm text-euroestetic opacity-80 hover:opacity-50 px-2 cursor-pointer"
              onClick={() => setMode(MODE.LOGIN)}
            >
              Volver a Login
            </div>
          )
        }
        {message && <div className="text-green-600 text-sm">{message}</div>}
      </div>
    </div>
  );
};

export default LoginPage;
