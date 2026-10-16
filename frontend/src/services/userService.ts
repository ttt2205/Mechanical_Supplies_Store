import { fetchApi } from "@/lib/api";
import { UserAccountItem, CreateUserPayload, UpdateUserPayload } from "@/types/user";

export const userService = {
    /**
     * Lấy danh sách tất cả tài khoản người dùng từ backend
     * Endpoint: GET /api/Admin/accounts
     */
    getAll: async (): Promise<UserAccountItem[]> => {
        const response = await fetchApi<UserAccountItem[]>('/admin/accounts');
        return Array.isArray(response) ? response : [];
    },

    /**
     * Tạo mới tài khoản người dùng
     * Endpoint: POST /api/Admin/accounts
     */
    create: async (payload: CreateUserPayload): Promise<any> => {
        return await fetchApi<any>('/admin/accounts', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    /**
     * Cập nhật thông tin tài khoản người dùng
     * Endpoint: PUT /api/Admin/accounts/{id}
     */
    update: async (id: number, payload: UpdateUserPayload): Promise<UserAccountItem> => {
        return await fetchApi<UserAccountItem>(`/admin/accounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    },

    /**
     * Xóa tài khoản người dùng theo ID
     * Endpoint: DELETE /api/Admin/accounts/{id}
     */
    delete: async (id: number): Promise<boolean> => {
        return await fetchApi<boolean>(`/admin/accounts/${id}`, {
            method: 'DELETE'
        });
    }
};
