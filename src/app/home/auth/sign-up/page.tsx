import Link from "next/link"
import SignUpForm from "./sign-up-form"
import * as countryCodes from "country-codes-list";

export default function SignUp() {
    const countryCodesArray = countryCodes.customList(
        "countryCode",
        "{countryCode}: +{countryCallingCode}"
    );

    return (
        <>
            <SignUpForm countryCodesArray={countryCodesArray}/>
            <p className="text-center mt-5">Already registered? <Link href="/dashboard" className="text-link">Sign In</Link></p>
        </>

    )
}