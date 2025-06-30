import Link from "next/link"
import SignUpForm from "./sign-up-form"
import countryCodes from "country-codes-list";

export default function SignUp() {
    const countryCodesArray:string[][] = Object.entries(countryCodes.customList('countryCode', '{countryCode}: +{countryCallingCode}'));
    return (
        <>
            <SignUpForm countryCodesArray={countryCodesArray}/>
            <p className="text-center mt-5">Already registered? <Link href="/home/auth/sign-in" className="text-link">Sign In</Link></p>
        </>

    )
}