import { fetchApi } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";

export const usePartners = () => {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchApi<any[]>('/partners');
            if (data) setPartners(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const refresh = async () => { setLoading(true); await loadData(); };

    const createPartner = async (payload: any) => {
        const res = await fetchApi<any>('/partners', { method: 'POST', body: JSON.stringify(payload) });
        if (res) await refresh();
        return res;
    };

    const updatePartner = async (id: number, payload: any) => {
        const res = await fetchApi<any>(`/partners/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res) await refresh();
        return res;
    };

    const deletePartner = async (id: number) => {
        const res = await fetchApi<any>(`/partners/${id}`, { method: 'DELETE' });
        if (res) await refresh();
        return res;
    };

    return { partners, loading, refresh, createPartner, updatePartner, deletePartner };
};

export const useUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchApi<any[]>('/admin/accounts');
            if (data) setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const refresh = async () => { setLoading(true); await loadData(); };

    const createUser = async (payload: any) => {
        const res = await fetchApi<any>('/admin/accounts', { method: 'POST', body: JSON.stringify(payload) });
        if (res) await refresh();
        return res;
    };

    const updateUser = async (id: number, payload: any) => {
        const res = await fetchApi<any>(`/admin/accounts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res) await refresh();
        return res;
    };

    const deleteUser = async (id: number) => {
        const res = await fetchApi<any>(`/admin/accounts/${id}`, { method: 'DELETE' });
        if (res) await refresh();
        return res;
    };

    return { users, loading, refresh, createUser, updateUser, deleteUser };
};

export const useRoles = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await fetchApi<any[]>('/roles');
            if (data) setRoles(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const refresh = async () => { setLoading(true); await loadData(); };

    const createRole = async (payload: any) => {
        const res = await fetchApi<any>('/roles', { method: 'POST', body: JSON.stringify(payload) });
        if (res) await refresh();
        return res;
    };

    const updateRole = async (id: number, payload: any) => {
        const res = await fetchApi<any>(`/roles/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
        if (res) await refresh();
        return res;
    };

    const deleteRole = async (id: number) => {
        const res = await fetchApi<any>(`/roles/${id}`, { method: 'DELETE' });
        if (res) await refresh();
        return res;
    };

    return { roles, loading, refresh, createRole, updateRole, deleteRole };
};

export const useLogs = () => {
    const [systemLogs, setSystemLogs] = useState<any[]>([]);
    const [errorLogs, setErrorLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data1 = await fetchApi<any[]>('/logs/system');
            if (data1) setSystemLogs(data1);
            const data2 = await fetchApi<any[]>('/logs/errors');
            if (data2) setErrorLogs(data2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadLogs(); }, []);

    return { systemLogs, errorLogs, loading, loadLogs };
};
