"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputFields from "../fields/input.fields.components";
import { useAppDispatch } from "@/lib/hooks";
import { verifyOTPHandler } from "@/lib/features/auth.features";
import { Path } from "react-hook-form";

type Props = {
    email?: string
}

const VerifyOTPForm = ({ email }: Props) => {
    const dispatch = useAppDispatch();

    const schema = yup.object({
        email: yup
            .string()
            .email("Invalid email.")
            .required("Email is required."),
        otp: yup
            .string()
            .required("OTP is required."),
    });

    type VerifyOTPFormValues = yup.InferType<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<VerifyOTPFormValues>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: { email: email || '' }
    });

    const fields = [
        { id: "vo-1", type: "email" as const, name: "email", label: "Email", placeholder: "john@example.com", multiline: false, rows: 1 },
        { id: "vo-2", type: "text" as const, name: "otp", label: "OTP", placeholder: "123456", multiline: false, rows: 1 },
    ];

    const handleVerifyOTP: (data: VerifyOTPFormValues) => Promise<void> = async (data) => {
        dispatch(verifyOTPHandler(data));
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleVerifyOTP)}>
            <div>
                {fields.map((field) => (
                    <InputFields
                        key={field.id}
                        label={field.label}
                        name={field.name as Path<VerifyOTPFormValues>}
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
                    Verify OTP
                </button>
            </div>
        </form>
    );
};

export default VerifyOTPForm;