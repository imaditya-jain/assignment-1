"use client";

import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { UseFormRegister, FieldErrors, Path } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface InputFieldsProps<T extends Record<string, unknown>> {
    type: "text" | "password" | "email" | "number" | "tel" | "file";
    name: Path<T>;
    placeholder: string;
    label: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    multline: boolean;
    rows: number,
}

const InputFields = <T extends Record<string, unknown>>({
    type,
    name,
    placeholder,
    register,
    errors,
    label,
    multline,
    rows
}: InputFieldsProps<T>) => {
    const [show, setShow] = useState(false);

    return (
        <div style={{ marginBottom: "1rem" }}>
            <TextField
                multiline={multline}
                rows={rows}
                type={type === "password" ? (show ? "text" : "password") : type}
                label={label}
                placeholder={placeholder}
                fullWidth
                error={!!errors[name]}
                helperText={errors[name]?.message as string}
                {...register(name)}
                InputProps={
                    type === "password"
                        ? {
                            endAdornment: (
                                <IconButton
                                    onClick={() => setShow(!show)}
                                    aria-label={show ? "Hide password" : "Show password"}
                                >
                                    {show ? <IoMdEyeOff /> : <IoMdEye />}
                                </IconButton>
                            ),
                        }
                        : undefined
                }
            />
        </div>
    );
};

export default InputFields;