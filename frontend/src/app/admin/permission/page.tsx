'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Shield, 
    ShieldCheck, 
    Save, 
    CheckSquare, 
    RotateCcw,
    RotateCw,
    Loader2,
    Layers,
    Lock,
    ShieldAlert
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { useToastStore } from '@/store/useToastStore';
import { useRoles } from '@/hooks/useAdminModules';

interface PermissionItem {
    id: number;
    code: string;
    name: string;
    groupName?: string;
}

export default function PermissionManagementPage() {
    const { roles, loading: rolesLoading, refresh: refreshRoles } = useRoles();
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [allPermissions, setAllPermissions] = useState<PermissionItem[]>([]);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
    const [loadingPermissions, setLoadingPermissions] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { addToast } = useToastStore();

    // 1. Set default selected role when roles are loaded
    useEffect(() => {
        if (roles.length > 0 && !selectedRoleId) {
            setSelectedRoleId(roles[0].id);
        }
    }, [roles, selectedRoleId]);

    // 2. Fetch all system permissions once
    const fetchPermissions = useCallback(async () => {
        try {
            const data = await fetchApi<PermissionItem[]>('/roles/permissions');
            if (data && Array.isArray(data)) {
                setAllPermissions(data);
            }
        } catch (err) {
            console.error('Fetch permissions error:', err);
            addToast('Không thể tải danh sách quyền hệ thống', 'error');
        }
    }, [addToast]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const handleReload = async () => {
        setIsRefreshing(true);
        try {
            await Promise.all([refreshRoles(), fetchPermissions()]);
        } catch (err) {
            console.error('Reload error:', err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // 3. Fetch active permission codes for selected role
    useEffect(() => {
        if (!selectedRoleId || allPermissions.length === 0) return;

        const fetchRolePermissions = async () => {
            setLoadingPermissions(true);
            try {
                const assignedCodes = await fetchApi<string[]>(`/roles/${selectedRoleId}/permissions`);
                if (assignedCodes && Array.isArray(assignedCodes)) {
                    const assignedSet = new Set(assignedCodes.map(c => c.toLowerCase()));
                    const activeIds = allPermissions
                        .filter(p => assignedSet.has(p.code.toLowerCase()))
                        .map(p => p.id);
                    setSelectedPermissionIds(activeIds);
                } else {
                    setSelectedPermissionIds([]);
                }
            } catch (err) {
                console.error('Fetch role permissions error:', err);
                addToast('Không thể tải quyền cho vai trò đã chọn', 'error');
            } finally {
                setLoadingPermissions(false);
            }
        };

        fetchRolePermissions();
    }, [selectedRoleId, allPermissions, addToast]);

    const currentRole = roles.find(r => r.id === selectedRoleId);
    const isAdminRole = Boolean(currentRole?.isAdmin || currentRole?.is_admin || (currentRole?.code || '').toUpperCase() === 'ADMIN');

    // 4. Toggle single permission ID
    const togglePermission = (permId: number) => {
        if (isAdminRole) {
            addToast('Quyền hạn của tài khoản Admin là mặc định (toàn quyền) và không được phép chỉnh sửa.', 'error');
            return;
        }
        setSelectedPermissionIds(prev => 
            prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
        );
    };

    // 5. Select all or deselect all
    const selectAll = () => {
        if (isAdminRole) return;
        setSelectedPermissionIds(allPermissions.map(p => p.id));
    };

    const deselectAll = () => {
        if (isAdminRole) return;
        setSelectedPermissionIds([]);
    };

    // 6. Save assignment to backend API
    const handleSavePermissions = async () => {
        if (!selectedRoleId) {
            addToast('Vui lòng chọn vai trò để phân quyền', 'error');
            return;
        }

        if (isAdminRole) {
            addToast('Quyền hạn của tài khoản Admin là cố định và không được phép thay đổi.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await fetchApi(`/roles/${selectedRoleId}/assign`, {
                method: 'POST',
                body: JSON.stringify(selectedPermissionIds)
            });
            addToast('Cấu hình phân quyền đã được lưu thành công!', 'success');
        } catch (err: any) {
            console.error('Save permissions error:', err);
            addToast(err?.message || 'Không thể lưu cấu hình phân quyền', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Group permissions by groupName
    const groupedPermissions = allPermissions.reduce((acc, perm) => {
        const group = perm.groupName || 'Hệ thống chung';
        if (!acc[group]) acc[group] = [];
        acc[group].push(perm);
        return acc;
    }, {} as Record<string, PermissionItem[]>);

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Phân quyền cho Vai trò</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Gán các danh mục quyền hạn thực tế từ API cho từng vai trò người dùng trong hệ thống.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={handleReload}
                        disabled={rolesLoading || loadingPermissions || isRefreshing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 text-xs font-bold transition-all shadow-xs hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Tải lại dữ liệu"
                    >
                        <RotateCw
                            size={15}
                            className={`text-slate-600 transition-transform ${rolesLoading || loadingPermissions || isRefreshing ? 'animate-spin text-brand-primary' : ''}`}
                        />
                        <span>{rolesLoading || loadingPermissions || isRefreshing ? 'Đang tải...' : 'Tải lại'}</span>
                    </button>
                    <button
                        onClick={handleSavePermissions}
                        disabled={isSaving || !selectedRoleId || isAdminRole}
                        className="bg-brand-primary text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-brand-primary/90 transition-all shadow-xs hover:shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isAdminRole ? 'Quyền Admin cố định' : 'Lưu phân quyền'}
                    </button>
                </div>
            </div>

            {/* Protective Admin Notice */}
            {isAdminRole && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3.5 text-amber-900 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 text-amber-700">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Quyền hạn Admin Bảo mật & Cố định</h4>
                        <p className="text-xs text-amber-700 font-medium mt-0.5">
                            Tài khoản Quản trị viên (Admin) tự động sở hữu 100% tất cả các quyền hạn trong hệ thống. Không được phép chỉnh sửa hoặc hạ quyền.
                        </p>
                    </div>
                </div>
            )}

            {/* Role Selection & Actions Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                    <div className="space-y-1.5 flex-1 max-w-md">
                        <label className="block text-xs font-semibold text-slate-700">Chọn Vai trò cần phân quyền (*)</label>
                        <div className="relative">
                            <select
                                value={selectedRoleId || ''}
                                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-brand-primary focus:bg-white transition-all cursor-pointer"
                            >
                                {rolesLoading ? (
                                    <option value="">Đang tải danh sách vai trò...</option>
                                ) : (
                                    roles.map(r => (
                                        <option key={r.id} value={r.id}>
                                            {r.name} [{r.code}] {Boolean(r.isAdmin || r.is_admin || (r.code || '').toUpperCase() === 'ADMIN') ? '⭐ (Admin cố định)' : ''}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    {currentRole && (
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isAdminRole ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200/60'}`}>
                            <Shield className={isAdminRole ? "text-amber-600" : "text-brand-primary"} size={20} />
                            <div>
                                <p className="text-xs font-bold text-slate-900">{currentRole.name}</p>
                                <p className="text-[10px] font-mono font-semibold text-brand-primary uppercase">
                                    {currentRole.code}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2 pt-2 md:pt-0">
                        <button
                            type="button"
                            onClick={selectAll}
                            disabled={isAdminRole}
                            className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <CheckSquare size={14} /> Chọn tất cả
                        </button>
                        <button
                            type="button"
                            onClick={deselectAll}
                            disabled={isAdminRole}
                            className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <RotateCcw size={14} /> Bỏ chọn tất cả
                        </button>
                    </div>
                </div>

                {/* Permissions Grid Grouped by Module */}
                {loadingPermissions ? (
                    <div className="py-16 text-center space-y-3">
                        <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto" />
                        <p className="text-sm font-medium text-slate-500">Đang tải quyền cho vai trò {currentRole?.name}...</p>
                    </div>
                ) : allPermissions.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 font-medium text-sm">
                        Chưa có quyền hạn hệ thống nào được thiết lập trong CSDL.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedPermissions).map(([groupName, perms]) => (
                            <div key={groupName} className="space-y-3">
                                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                                    <Layers size={16} className="text-brand-primary" />
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{groupName}</h3>
                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {isAdminRole ? perms.length : perms.filter(p => selectedPermissionIds.includes(p.id)).length} / {perms.length}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {perms.map(perm => {
                                        const isChecked = isAdminRole || selectedPermissionIds.includes(perm.id);
                                        return (
                                            <div
                                                key={perm.id}
                                                onClick={() => togglePermission(perm.id)}
                                                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 select-none ${
                                                    isAdminRole 
                                                        ? 'bg-amber-50/40 border-amber-200/60 text-slate-800 cursor-not-allowed'
                                                        : isChecked 
                                                            ? 'bg-brand-primary/5 border-brand-primary/30 text-slate-900 shadow-xs cursor-pointer' 
                                                            : 'bg-white border-slate-200/80 hover:border-slate-300 text-slate-600 cursor-pointer'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    disabled={isAdminRole}
                                                    onChange={() => {}} // Handled by div onClick
                                                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary/20 cursor-pointer pointer-events-none disabled:opacity-75"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-1">
                                                        <p className="text-xs font-semibold text-slate-900 leading-snug">{perm.name}</p>
                                                        {isAdminRole && <Lock size={12} className="text-amber-600 shrink-0" />}
                                                    </div>
                                                    <p className="text-[10px] font-mono font-medium text-brand-primary mt-0.5">{perm.code}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
