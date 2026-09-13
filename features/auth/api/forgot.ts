import clientAxios from "@/lib/axios/clientAxios";

export const forgotPassword = async (data: {
  email: string
}) => {
  const res = await clientAxios.post('auth/forgotPassword', data)
  return res.data
}

export const verifyResetCode = async (data: { resetCode: string }) => {
  const res = await clientAxios.post("auth/verifyResetCode", data);
  return res.data;
};

export const resetPassword = async (data: {
  email: string;
  newPassword: string;
}) => {
  const res = await clientAxios.patch("auth/resetPassword", data);
  return res.data;
};