// Express/MongoDB Backend API Service
import * as SecureStore from 'expo-secure-store';

// For local development with mobile device, replace 'localhost' with your computer's IP
// Find your IP: run 'ipconfig' in terminal and look for IPv4 Address
// Current IP: 192.168.1.33 (update this if your IP changes)
// For Expo tunnel mode, using localtunnel: https://verdict-api.loca.lt
const API_BASE_URL = 'https://verdict-jqed.onrender.com/api';

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    [key: string]: any;
}

// Token management
const TOKEN_KEY = 'auth_token';

export const TokenManager = {
    async getToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    },

    async setToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    },

    async removeToken(): Promise<void> {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
};

/**
 * Generic API Request Handler
 * @param endpoint - API endpoint (without /api prefix)
 * @param method - HTTP method
 * @param body - Request body object or FormData
 * @param requiresAuth - Whether the request requires authentication
 */
async function apiRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    requiresAuth: boolean = false
): Promise<ApiResponse> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API Request] ${method} ${url}`);

    try {
        const headers: HeadersInit = {
            'Accept': 'application/json',
        };

        // Add authentication token if required
        if (requiresAuth) {
            const token = await TokenManager.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Only set Content-Type if body is NOT FormData
        if (!(body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const options: RequestInit = {
            method,
            headers,
        };

        if (body) {
            options.body = body instanceof FormData ? body : JSON.stringify(body);
        }

        const response = await fetch(url, options);

        // Get text first to debug potential errors
        const text = await response.text();
        console.log(`[API Response] ${endpoint}:`, text.substring(0, 500));

        try {
            const data = JSON.parse(text);

            // Return the response data
            return data;

        } catch (parseError) {
            console.error(`[API Parse Error] ${endpoint}:`, parseError);
            return {
                success: false,
                message: 'Invalid response from server. Check logs.',
                raw: text
            };
        }

    } catch (error: any) {
        console.error(`[API Network Error] ${endpoint}:`, error);
        return {
            success: false,
            message: error.message || 'Network request failed. Please check your connection.',
        };
    }
}

export const Api = {
    // ========== AUTHENTICATION ==========
    auth: {
        async signup(userData: { name: string; email: string; password: string; role?: string }) {
            const response = await apiRequest('/auth/signup', 'POST', userData);
            return response;
        },

        async verifyOtp(email: string, otp: string) {
            const response = await apiRequest('/auth/verify-otp', 'POST', { email, otp });

            // Store token if verification successful
            if (response.success && response.data?.token) {
                await TokenManager.setToken(response.data.token);
            }

            return response;
        },

        async login(email: string, password: string) {
            const response = await apiRequest('/auth/login', 'POST', { email, password });

            // Store token if login successful
            if (response.success && response.data?.token) {
                await TokenManager.setToken(response.data.token);
            }

            return response;
        },

        async logout() {
            await TokenManager.removeToken();
            return { success: true, message: 'Logged out successfully' };
        }
    },

    // ========== USER ==========
    user: {
        async updateProfile(profileData: any) {
            // For image upload, you may need to convert to FormData
            // For now, sending as JSON
            const response = await apiRequest('/user/profile', 'PUT', profileData, true);
            return response;
        }
    },

    // ========== ATTORNEYS ==========
    attorneys: {
        async getAll() {
            const response = await apiRequest('/attorneys', 'GET');
            return response;
        }
    },

    // ========== ATTORNEY REGISTRATION ==========
    attorney: {
        async registerAndSendOtp(userData: { name: string; email: string; password: string; license: string }) {
            // Attorney signup with license number
            const response = await apiRequest('/auth/signup', 'POST', {
                ...userData,
                role: 'attorney'
            });
            return response;
        },

        async verifyOtp(email: string, otp: string) {
            const response = await apiRequest('/auth/verify-otp', 'POST', { email, otp });

            // Store token if verification successful
            if (response.success && response.data?.token) {
                await TokenManager.setToken(response.data.token);
            }

            return response;
        },

        async resendOtp(email: string) {
            const response = await apiRequest('/auth/resend-otp', 'POST', { email });
            return response;
        },

        async login(email: string, password: string) {
            const response = await apiRequest('/auth/login', 'POST', { email, password });

            // Store token if login successful
            if (response.success && response.data?.token) {
                await TokenManager.setToken(response.data.token);
            }

            return response;
        }
    }
};
