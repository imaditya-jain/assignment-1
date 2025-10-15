"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputFields from "../fields/input.fields.components";
import { useAppDispatch } from "@/lib/hooks";
import { registerHandler } from "@/lib/features/auth.features";
import { Path } from "react-hook-form"; console.log();
import { User } from "@/types/user.types";

interface RegistrationFormProps {
    isEdit: boolean;
    user: User | null;
}

const RegistrationForm = ({ isEdit, user }: RegistrationFormProps) => {
    const dispatch = useAppDispatch();

    const schema = yup.object({
        firstName: yup
            .string()
            .matches(/^[A-Za-z]+$/, "First name should only contain alphabets")
            .required("First name is required."),
        lastName: yup
            .string()
            .matches(/^[A-Za-z]+$/, "Last name should only contain alphabets")
            .required("Last name is required."),
        email: yup
            .string()
            .email("Invalid email.")
            .required("Email is required."),
        ...(isEdit
            ? {}
            : {
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
            }),
    });

    type RegistrationFormValues = yup.InferType<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegistrationFormValues>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
        },
    });

    const fields = [
        {
            id: "rf-1", type: "text" as const, name: "firstName", label: "Firstname", placeholder: "John", multiline: false, rows: 1
        },
        { id: "rf-2", type: "text" as const, name: "lastName", label: "Lastname", placeholder: "Doe", multiline: false, rows: 1 },
        { id: "rf-3", type: "email" as const, name: "email", label: "Email", placeholder: "john@example.com", multiline: false, rows: 1 },
        ...(isEdit
            ? []
            : [
                { id: "rf-5", type: "password" as const, name: "password", label: "Password", placeholder: "********", multiline: false, rows: 1 },
                { id: "rf-6", type: "password" as const, name: "confirmPassword", label: "Confirm Password", placeholder: "********", multiline: false, rows: 1 },
            ]),
    ];

    const handleRegistration: (data: RegistrationFormValues) => Promise<void> = async (data) => {
        if (!isEdit) {
            const newData = {
                ...data,
                password: String(data.password),
                confirmPassword: String(data.confirmPassword),
                role: "user" as const,
            };

            dispatch(registerHandler(newData));
            reset();
        } else {
            if (user !== null) {
                const updatedData = {
                    ...data,
                };

                dispatch(updateUser({ id: user._id, data: updatedData }));
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(handleRegistration)}>
            <div>
                {fields.map((field) => (
                    <InputFields
                        key={field.id}
                        label={field.label}
                        name={field.name as Path<RegistrationFormValues>}
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
                    {isEdit ? "Update" : "Register"}
                </button>
            </div>
        </form>
    );
};

export default RegistrationForm;

// TODO: Implement updateUser or import from the correct module if available
function updateUser({ id, data }: { id: string; data: Partial<User> }): never {
    throw new Error(`Function not implemented for user id: ${id} data: ${JSON.stringify(data)}`);
}
