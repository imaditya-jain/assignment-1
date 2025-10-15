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

export const registerHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/register",
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

export const loginHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/login",
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

export const verifyOTPHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/verify-otp",
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

export const forgotPasswordHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/forgot-password",
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

export const resetPasswordHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/reset-password",
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

export const authCheckHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/auth-check",
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

export const refreshTokenHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/refresh-token",
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

export const logoutHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
    "/auth/logout",
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

// export const fetchTokensHandler = createAsyncThunk<Response, Record<string, unknown>, { rejectValue: Error }>(
//     "/auth/fetch-tokens",
//     async (str, { rejectWithValue }) => {
//         try {
//             const response = await axios.post<Response>("/api/v2/auth/fetch-tokens", { withCredentials: true });
//             return response.data;
//         } catch (error) {
//             if (error instanceof AxiosError) {
//                 return rejectWithValue({
//                     status: error.response?.status || 500,
//                     success: false,
//                     message: error.response?.data?.message || "",
//                     data: error.response?.data || null,
//                 });
//             }
//             return rejectWithValue({
//                 status: 500,
//                 success: false,
//                 message: "Something went wrong.",
//                 data: null,
//             });
//         }
//     }
// );