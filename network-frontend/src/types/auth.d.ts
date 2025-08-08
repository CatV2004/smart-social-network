export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}

export interface UserResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
}

export interface AuthError {
    message: string;
    error: string;
    statusCode: number;
}