"use client";

import { useForm } from "react-hook-form";
import { useResetPassword } from "@/features/auth/hooks/Auth";
import { useRouter } from "next/navigation";
import { ResetPasswordFormData, resetPasswordSchema } from "@/features/auth/schemas/auth.schema";
import { AuthActionResult } from "@/features/auth/types/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { LockKeyhole, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { UniInput } from "@/components/shared/UniInput";

export default function ResetPasswordPage() {
    const { mutate, isPending } = useResetPassword();
    const router = useRouter();
    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "all",
        defaultValues: {
            email: "",
            newPassword: "",
        },
    });

    const {
        handleSubmit,
        control,
    } = form;

    const onSubmit = (data: ResetPasswordFormData) => {
        mutate(data, {
            onSuccess: (res: AuthActionResult) => {
                toast.success(res.message || "Password reset successfully!");

                setTimeout(() => {
                    router.push("/login");
                }, 1500);
            },
            onError: (err: AuthActionResult) => {
                toast.error(err.response?.data?.message || "Something went wrong");
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-4">
            
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <LockKeyhole className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
                    <p className="text-gray-500">
                        Create a new strong password for your account.
                    </p>
                </div>
                <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <UniInput
                            control={control}
                            name="email"
                            label="Email Address"
                            placeholder="Enter your email"
                            type="email"
                            required
                            className="space-y-2"
                        />
                    <UniInput
                        control={control}
                        name="newPassword"
                        label="New Password"
                        placeholder="Enter new password"
                        type="password"
                        required
                        className="space-y-2"
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02]"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Resetting Password...
                            </>
                        ) : (
                            <>
                                Reset Password
                                <CheckCircle className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                </form>
                </Form>
            </motion.div>
        </div>
    );
}