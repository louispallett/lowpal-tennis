import Link from "next/link"
import SignUpForm from "./sign-up-form"

export default function SignUp() {
    return (
        <>
            <SignUpForm />
            <p className="text-center mt-5">Already registered? <Link href="/home/auth/sign-in" className="text-link">Sign In</Link></p>
        </>

    )
}