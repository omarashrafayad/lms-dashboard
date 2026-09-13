"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {forgotPasswordSchema,ForgotPasswordFormData,} from "@/features/auth/schemas/auth.schema";
import { useForgotPassword } from "@/features/auth/hooks/Auth";
import { useRouter } from "next/navigation";
import { AuthActionResult } from "@/features/auth/types/auth.types";
import { motion } from "motion/react";
import {Mail,ArrowRight,Loader2,ArrowLeft,} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import { UniInput } from "@/components/shared/UniInput";
import { Form } from "@/components/ui/form";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { mutate, isPending } = useForgotPassword();

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "all",
        defaultValues: {
            email: "",
        }});
        
    const {
        handleSubmit,
        control,
    } = form;

    const onSubmit = (data: ForgotPasswordFormData) => {
        mutate(data, {
            onSuccess: (res: AuthActionResult) => {
                toast.success(res.message || "Check your email for reset link");
                setTimeout(() => {
                    router.push("/auth/verify-code");
                }, 2000);
            },
            onError: (err: AuthActionResult) => {
                toast.error(err.response?.data?.message || "Something went wrong");
            },
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
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <PageHeader title="Forgot Password" description="Don't worry! It happens. Please enter the email associated with your account." />
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
                    />
                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02]"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending Instructions...
                            </>
                        ) : (
                            <>
                                Send Reset Link
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </button>
                    </div>
                </form>
                </Form>
            </motion.div>
        </div>
    );
}