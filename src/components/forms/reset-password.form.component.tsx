"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputFields from "../fields/input.fields.components";
import { useAppDispatch } from "@/lib/hooks";
import { resetPasswordHandler } from "@/lib/features/auth.features";
import { Path } from "react-hook-form";

type Props = {
    email?: string
}

const ResetPasswordForm = ({ email }: Props) => {
    const dispatch = useAppDispatch();

    const schema = yup.object({
        email: yup
            .string()
            .email("Invalid email.")
            .required("Email is required."),
        otp: yup
            .string()
            .required("OTP is required."),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters long.")
            .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
            .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
            .matches(/[0-9]/, "Password must contain at least one number.")
            .matches(/[@$!%*?&#]/, "Password must contain at least one special character.")
            .required("Password is required."),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match.")
            .required("Confirm password is required."),
    });

    type ResetPasswordFormValues = yup.InferType<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ResetPasswordFormValues>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: { email: email || '' }
    });

    const fields = [
        { id: "rp-1", type: "email" as const, name: "email", label: "Email", placeholder: "john@example.com", multiline: false, rows: 1 },
        { id: "rp-2", type: "text" as const, name: "otp", label: "OTP", placeholder: "123456", multiline: false, rows: 1 },
        { id: "rp-3", type: "password" as const, name: "password", label: "Password", placeholder: "********", multiline: false, rows: 1 },
        { id: "rp-4", type: "password" as const, name: "confirmPassword", label: "Confirm Password", placeholder: "********", multiline: false, rows: 1 },
    ];

    const handleResetPassword: (data: ResetPasswordFormValues) => Promise<void> = async (data) => {
        dispatch(resetPasswordHandler(data));
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleResetPassword)}>
            <div>
                {fields.map((field) => (
                    <InputFields
                        key={field.id}
                        label={field.label}
                        name={field.name as Path<ResetPasswordFormValues>}
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
                    Reset Password
                </button>
            </div>
        </form>
    );
};

export default ResetPasswordForm;