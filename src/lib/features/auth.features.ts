import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { User } from '@/types/user.types'

interface Response {
    status: number;
    success: boolean;
    message: string;
    data: {
        user: User;
        accessToken: string | null;
        refreshToken: string | null;
    };
}

interface Error {
    status: number;
    success: boolean;
    message: string;
    data: Record<string, unknown> | null;
}

// Login data interface
interface LoginData {
    email: string;
    password: string;
}

// Verify OTP data interface
interface VerifyOTPData {
    email: string;
    otp: string;
}

// Forgot password data interface
interface ForgotPasswordData {
    email: string;
}

// Reset password data interface
interface ResetPasswordData {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
}

// Register data interface
interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: "user";
}

export const registerHandler = createAsyncThunk<Response, RegisterData, { rejectValue: Error }>(
    "/account/register",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/register", data, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "Registration failed.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const loginHandler = createAsyncThunk<Response, LoginData, { rejectValue: Error }>(
    "/account/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/login", data, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "Login failed.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const verifyOTPHandler = createAsyncThunk<Response, VerifyOTPData, { rejectValue: Error }>(
    "/account/verify-otp",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/verify-otp", data, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "Failed to verify otp.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const forgotPasswordHandler = createAsyncThunk<Response, ForgotPasswordData, { rejectValue: Error }>(
    "/account/forgot-password",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/forgot-password", data, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "Failed to reset password.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const resetPasswordHandler = createAsyncThunk<Response, ResetPasswordData, { rejectValue: Error }>(
    "/account/reset-password",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/reset-password", data, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "Failed to reset password.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const authCheckHandler = createAsyncThunk<Response, void, { rejectValue: Error }>(
    "/account/auth-check",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/auth-check", {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "You are not authorized. Please login again.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const refreshTokenHandler = createAsyncThunk<Response, void, { rejectValue: Error }>(
    "/account/refresh-token",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/refresh-token", {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "You are not authorized. Please login again.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);

export const logoutHandler = createAsyncThunk<Response, void, { rejectValue: Error }>(
    "/account/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.post<Response>("/api/v2/auth/logout", {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return rejectWithValue({
                    status: error.response?.status || 500,
                    success: false,
                    message: error.response?.data?.message || "Logout failed.",
                    data: error.response?.data || null,
                });
            }
            return rejectWithValue({
                status: 500,
                success: false,
                message: "Something went wrong.",
                data: null,
            });
        }
    }
);