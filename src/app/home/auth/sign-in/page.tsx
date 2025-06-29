import Link from "next/link"
import SignInForm from "./sign-in-form"

export default function SignIn() {
    return (
        <>
            <SignInForm />
            <p className="text-center mt-5">Not registered? <Link href="/home/auth/sign-up" className="text-link">Register</Link></p>
        </>
    )
}