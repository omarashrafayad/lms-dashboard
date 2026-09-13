import { forgotPassword, resetPassword, verifyResetCode } from "@/features/auth/api/forgot"
import { useMutation } from "@tanstack/react-query"
import { AuthActionResult } from "../types/auth.types";

const handleMutationError = (error: AuthActionResult) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return "Something went wrong";
};
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onError: handleMutationError,
    })
}
export const useVerifyCode = () => {
  return useMutation({
    mutationFn: verifyResetCode,
      onError: handleMutationError,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
      onError: handleMutationError,
  });
};


