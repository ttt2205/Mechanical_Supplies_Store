import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useToastStore } from '@/store/useToastStore';

if (typeof process !== 'undefined' && process.env) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5117/api';

// Create Axios Instance
export const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void, reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });
    failedQueue = [];
};

// Request Interceptor: Attach Token & Handle FormData Content-Type
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const authDataStr = localStorage.getItem('auth-storage');
        if (authDataStr) {
            try {
                const parsed = JSON.parse(authDataStr);
                const token = parsed?.state?.accessToken;
                if (token && token !== 'null' && token !== 'undefined') {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (e) {}
        }
    }

    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
    }

    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle Errors & Refresh Token
axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Handle network errors
        if (!error.response) {
            const method = originalRequest.method?.toUpperCase() || 'GET';
            const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
            
            if (isMutation) {
                console.error(`[API Error] Failed to fetch ${originalRequest.url}:`, error.message);
                if (typeof window !== 'undefined') {
                    useToastStore.getState().addToast(`Không thể kết nối đến máy chủ: ${error.message}`, 'error');
                }
            }
            return Promise.reject(error);
        }

        // Handle 401 Unauthorized
        if (error.response.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/Authentication/refresh-token')) {
                if (typeof window !== 'undefined') {
                    window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                }
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return axiosClient(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            return new Promise(async (resolve, reject) => {
                try {
                    let reqToken = null;
                    const authDataStr = localStorage.getItem('auth-storage');
                    if (authDataStr) {
                        try {
                            reqToken = JSON.parse(authDataStr)?.state?.refreshToken;
                        } catch (e) {}
                    }

                    if (!reqToken) throw new Error('No refresh token');

                    const { data } = await axios.post(`${API_BASE_URL}/Authentication/refresh-token`, {
                        refreshToken: reqToken
                    });

                    if (data?.success && data?.data?.accessToken) {
                        const newAccessToken = data.data.accessToken;
                        // Update storage
                        const currData = JSON.parse(authDataStr || '{}');
                        if (currData.state) {
                            currData.state.accessToken = newAccessToken;
                            currData.state.refreshToken = data.data.refreshToken;
                            localStorage.setItem('auth-storage', JSON.stringify(currData));
                        }
                        
                        axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                        
                        processQueue(null, newAccessToken);
                        resolve(axiosClient(originalRequest));
                    } else {
                        throw new Error('Refresh failed');
                    }
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    if (typeof window !== 'undefined') {
                        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
                    }
                    reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            });
        }

        // Handle other errors (like 400, 403, 500)
        const errorData = error.response.data as any;
        const errorMsg = errorData?.message || `Lỗi từ máy chủ (${error.response.status}): Không thể thực hiện yêu cầu.`;
        
        const method = originalRequest.method?.toUpperCase() || 'GET';
        const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
        
        if (isMutation && typeof window !== 'undefined') {
            useToastStore.getState().addToast(errorMsg, 'error');
        }

        return Promise.reject(error);
    }
);

/**
 * Legacy wrapper to maintain compatibility with existing components using `fetchApi`
 */
export const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    try {
        const isFormData = options?.body instanceof FormData;
        
        // Convert string body to JSON object for axios, unless it's FormData
        let data = options?.body;
        if (typeof data === 'string' && !isFormData) {
            try {
                data = JSON.parse(data);
            } catch (e) {}
        }

        // Create headers object
        const headers: any = { ...options?.headers };
        if (isFormData) {
            // Let axios/browser automatically set multipart/form-data boundary
            delete headers['Content-Type'];
            delete headers['content-type'];
            headers['Content-Type'] = undefined;
        } else if (data && !headers['Content-Type'] && !headers['content-type']) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axiosClient.request({
            url: endpoint,
            method: options?.method || 'GET',
            headers: headers,
            data: data,
        });

        const result = response.data;
        return (result?.data !== undefined ? result.data : result) as T;
    } catch (error: any) {
        // Return null for backwards compatibility with how fetchApi was previously used
        return null as any;
    }
};
