import LoginForm from "@/features/auth/template/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login | Scholar Admin Console",
    description: "Login to your account",
}

export default function Page() {
    return <LoginForm />
}   