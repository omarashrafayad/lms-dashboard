"use client";

import { cn } from "@/lib/utils";
import {SignupFormData,signupSchema,} from "@/features/auth/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {Loader2,} from "lucide-react";
import Link from "next/link";
import { signupAction } from "@/features/auth/api/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UniInput } from "@/components/shared/UniInput";
import { Form } from "@/components/ui/form";

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter();

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "all",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (data: SignupFormData) => {
        try {
            const res = await signupAction(data);
            if (res?.success) {
                router.push("/");
            } else {
                toast.error(res?.error || "Signup failed. Please try again.");
            }
        } catch (error) {
            toast.error(error as string || "An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4">
            <div
                className={cn(
                    "w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2 min-h-[600px]",
                    className,
                )}
            >
                <div className="hidden md:flex flex-col items-center justify-center bg-[#4F46E5] text-white p-12 relative overflow-hidden">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/10 rounded-full"></div>

                    <div className="relative z-10 text-center space-y-6 max-w-sm">
                        <h2 className="text-4xl font-bold leading-tight">
                            Join Our Community
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Discover amazing products and start your journey with us.
                        </p>
                    </div>

                    <div className="absolute top-12 left-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    </div>
                    <div className="absolute bottom-12 right-8 flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="w-full max-w-md mx-auto space-y-6">
                        <div className="text-center md:text-left space-y-2">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                                <span className="text-2xl font-bold text-[#4F46E5]">E</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Create Account
                            </h1>
                        </div>
                        <Form {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                            {...props}
                        >
                                <UniInput
                                    control={control}
                                    name="name"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    type="text"
                                    required
                                    className="space-y-2"
                                />
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
                                    name="password"
                                    label="Password"
                                    placeholder="Enter your password"
                                    type="password"
                                    required
                                    className="space-y-2"
                                />
                                <UniInput
                                    control={control}
                                    name="passwordConfirm"
                                    label="passwordConfirm"
                                    placeholder="Enter your passwordConfirm"
                                    type="password"
                                    required
                                    className="space-y-2"
                                />

                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#5C67F6] cursor-pointer hover:bg-[#4a55e3] text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Customizing...
                                    </>
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                            <div className="text-center mt-6">
                                <span className="text-gray-500 text-sm">
                                    Already have an account?{" "}
                                </span>
                                <Link
                                    href="/auth/login"
                                    className="text-blue-600 font-semibold hover:underline text-sm ml-1"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
}