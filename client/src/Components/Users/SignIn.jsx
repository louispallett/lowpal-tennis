import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignIn() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [serverError, setServerError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        setIsPending(true)
        axios.post("/api/users/sign-in", data)
            .then(response => {
                const token = response.data.token;
                if (!token) {
                    setIsPending(false);
                    console.log(response);
                    setLoginError(response.data.error);
                    console.log(loginError);
                    return;
                }
                localStorage.setItem("Authorization", token);
                console.log(token);
                window.location.assign("/dashboard");
            }).catch(err => {
                console.log(err);
                setIsPending(false);
                setServerError(err);
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="form">
            <div className="relative w-full h-full flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                    <input type="email" className="form-input" placeholder="Email"
                        {...register ("email", {
                            required: "Email is required",
                            maxLength: {
                                value: 100,
                                message: "Email cannot be longer than a hundred (100) characters long!"
                            },
                        })}
                    />
                    <input type="password" className="form-input" placeholder="Password"
                        {...register ("password", {
                            required: "Password is required",
                        })}
                    />
                </div>
                <button type="submit" 
                    className="submit"
                >Login</button>
            </div>
        </form>
    )
}