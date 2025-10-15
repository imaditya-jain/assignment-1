import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authCheckHandler, forgotPasswordHandler, loginHandler, logoutHandler, refreshTokenHandler, registerHandler, resetPasswordHandler, verifyOTPHandler } from "../features/auth.features";
import { User } from '@/types/user.types'

interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
}

interface AuthData {
    user: User;
    accessToken?: string | null;
    refreshToken?: string | null;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: boolean;
    message: string;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: false,
    message: "",
    accessToken: null,
    refreshToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPending: (state: AuthState) => {
            state.loading = true;
            state.error = false;
            state.message = '';
        },

        setFulfilled: (state: AuthState, action: PayloadAction<ApiResponse<AuthData>>) => {
            state.loading = false;
            state.error = false;
            state.message = action.payload?.message || '';
        },

        setRejected: (state: AuthState, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload?.message || 'An error occurred.'
        },
        clearState: (state) => {
            state.message = ''
            state.error = false
            state.loading = false
        },
        clearAuthState: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.accessToken = null
            state.refreshToken = null
            state.error = false
            state.loading = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(registerHandler.fulfilled, (state, action) => { authSlice.caseReducers.setFulfilled(state, action) })
            .addCase(registerHandler.rejected, (state, action) => { authSlice.caseReducers.setRejected(state, action) })

            .addCase(loginHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(loginHandler.fulfilled, (state, action) => {
                authSlice.caseReducers.setFulfilled(state, action)
                // Login only sends OTP, doesn't authenticate yet
            })
            .addCase(loginHandler.rejected, (state, action) => { authSlice.caseReducers.setRejected(state, action) })

            .addCase(verifyOTPHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(verifyOTPHandler.fulfilled, (state, action) => {
                authSlice.caseReducers.setFulfilled(state, action)
                state.user = action.payload.data?.user
                state.isAuthenticated = action.payload.success
                state.accessToken = action.payload?.data?.accessToken
                state.refreshToken = action.payload.data?.refreshToken
            })
            .addCase(verifyOTPHandler.rejected, (state, action) => {
                authSlice.caseReducers.setRejected(state, action)
                state.user = null
                state.isAuthenticated = false
                state.accessToken = null
                state.refreshToken = null
            })

            .addCase(logoutHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(logoutHandler.fulfilled, (state, action) => {
                authSlice.caseReducers.setFulfilled(state, action)
                state.isAuthenticated = false
                state.user = null
                state.accessToken = null
                state.refreshToken = null
            })
            .addCase(logoutHandler.rejected, (state, action) => { authSlice.caseReducers.setRejected(state, action) })

            .addCase(forgotPasswordHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(forgotPasswordHandler.fulfilled, (state, action) => { authSlice.caseReducers.setFulfilled(state, action) })
            .addCase(forgotPasswordHandler.rejected, (state, action) => { authSlice.caseReducers.setRejected(state, action) })

            .addCase(resetPasswordHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(resetPasswordHandler.fulfilled, (state, action) => { authSlice.caseReducers.setFulfilled(state, action) })
            .addCase(resetPasswordHandler.rejected, (state, action) => { authSlice.caseReducers.setRejected(state, action) })

            .addCase(authCheckHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(authCheckHandler.fulfilled, (state, action) => {
                authSlice.caseReducers.setFulfilled(state, action)
                state.user = action.payload.data?.user
                state.isAuthenticated = action.payload.success
                state.accessToken = action.payload?.data?.accessToken
                state.refreshToken = action.payload?.data?.refreshToken
            })
            .addCase(authCheckHandler.rejected, (state, action) => {
                authSlice.caseReducers.setRejected(state, action)
                state.user = null
                state.isAuthenticated = false
                state.accessToken = null
                state.refreshToken = null
            })

            .addCase(refreshTokenHandler.pending, (state) => { authSlice.caseReducers.setPending(state) })
            .addCase(refreshTokenHandler.fulfilled, (state, action) => {
                authSlice.caseReducers.setFulfilled(state, action)
                state.user = action.payload.data?.user
                state.isAuthenticated = action.payload.success
                state.accessToken = action.payload?.data?.accessToken
                state.refreshToken = action.payload?.data?.refreshToken
            })
            .addCase(refreshTokenHandler.rejected, (state, action) => {
                authSlice.caseReducers.setRejected(state, action)
                state.user = null
                state.isAuthenticated = false
                state.accessToken = null
                state.refreshToken = null
            })
    }
})

export const { clearState, clearAuthState } = authSlice.actions
export default authSlice.reducer