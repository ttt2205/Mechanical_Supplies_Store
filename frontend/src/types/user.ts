export interface UserRole {
    id: number;
    code: string;
    name: string;
    description?: string;
    isAdmin?: boolean;
}

export interface UserAccountItem {
    id: number;
    roleId: number;
    role_id?: string | number;
    username: string;
    email: string;
    fullName?: string;
    fullname?: string;
    phone?: string;
    status: 'ACTIVE' | 'INACTIVE' | string;
    creationTime?: string;
    lastModificationTime?: string;
    lastLogin?: string;
    role?: UserRole;
}

export interface CreateUserPayload {
    roleId: number;
    username: string;
    password: string;
    email: string;
    fullName?: string;
    phone?: string;
    status?: string;
}

export interface UpdateUserPayload {
    roleId?: number;
    email?: string;
    fullName?: string;
    phone?: string;
    status?: string;
    password?: string;
}
