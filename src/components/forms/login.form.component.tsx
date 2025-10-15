"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputFields from "../fields/input.fields.components";
import { useAppDispatch } from "@/lib/hooks";
import { loginHandler } from "@/lib/features/auth.features";
import { Path } from "react-hook-form";

const LoginForm = () => {
    const dispatch = useAppDispatch();

    const schema = yup.object({
        email: yup
            .string()
            .email("Invalid email.")
            .required("Email is required."),
        password: yup
            .string()
            .required("Password is required."),
    });

    type LoginFormValues = yup.InferType<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const fields = [
        { id: "lf-1", type: "email" as const, name: "email", label: "Email", placeholder: "john@example.com", multiline: false, rows: 1 },
        { id: "lf-2", type: "password" as const, name: "password", label: "Password", placeholder: "********", multiline: false, rows: 1 },
    ];

    const handleLogin: (data: LoginFormValues) => Promise<void> = async (data) => {
        try { sessionStorage.setItem('email', data.email) } catch { }
        dispatch(loginHandler(data));
    };

    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <div>
                {fields.map((field) => (
                    <InputFields
                        key={field.id}
                        label={field.label}
                        name={field.name as Path<LoginFormValues>}
                        type={field.type}
                        placeholder={field.placeholder}
                        errors={errors}
                        register={register}
                        multline={field.multiline}
                        rows={field.rows}
                    />
                ))}
            </div>
            <div>
                <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] p-3 text-white font-[600] rounded-md"
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default LoginForm;