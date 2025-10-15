"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputFields from "../fields/input.fields.components";
import { useAppDispatch } from "@/lib/hooks";
import { forgotPasswordHandler } from "@/lib/features/auth.features";
import { Path } from "react-hook-form";

const ForgotPasswordForm = () => {
    const dispatch = useAppDispatch();

    const schema = yup.object({
        email: yup
            .string()
            .email("Invalid email.")
            .required("Email is required."),
    });

    type ForgotPasswordFormValues = yup.InferType<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ForgotPasswordFormValues>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const fields = [
        { id: "fp-1", type: "email" as const, name: "email", label: "Email", placeholder: "john@example.com", multiline: false, rows: 1 },
    ];

    const handleForgotPassword: (data: ForgotPasswordFormValues) => Promise<void> = async (data) => {
        try { sessionStorage.setItem('email', data.email) } catch {}
        dispatch(forgotPasswordHandler(data));
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleForgotPassword)}>
            <div>
                {fields.map((field) => (
                    <InputFields
                        key={field.id}
                        label={field.label}
                        name={field.name as Path<ForgotPasswordFormValues>}
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
                    Send Reset Link
                </button>
            </div>
        </form>
    );
};

export default ForgotPasswordForm;