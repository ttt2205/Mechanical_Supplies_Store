'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

/**
 * Checks whether a given role has administrative privileges.
 * Prohibits standard customers, guests, or undefined roles.
 */
export function isAuthorizedAdminRole(role?: string | null): boolean {
  if (!role) return false;
  const normalized = role.trim().toUpperCase();
  if (['CUSTOMER', 'KHÁCH HÀNG', 'USER', 'GUEST', ''].includes(normalized)) {
    return false;
  }
  return true;
}

/**
 * Checks if a JWT token has expired based on its 'exp' claim.
 */
function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return false;
    // 10-second buffer
    return payload.exp * 1000 < Date.now() + 10000;
  } catch {
    return true;
  }
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setTokens, logout } = useAuthStore();
  
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized' | 'unauthenticated'>('checking');
  const [statusMessage, setStatusMessage] = useState('Đang kiểm tra quyền truy cập...');
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      if (isVerifyingRef.current) return;
      isVerifyingRef.current = true;

      try {
        // 1. Wait for Zustand persist hydration
        if (!useAuthStore.persist.hasHydrated()) {
          await new Promise<void>((resolve) => {
            const unsub = useAuthStore.persist.onFinishHydration(() => {
              unsub();
              resolve();
            });
          });
        }

        const state = useAuthStore.getState();
        const currentAuth = state.isAuthenticated;
        const currentUser = state.user;
        let currentToken = state.accessToken;
        const currentRefreshToken = state.refreshToken;

        // 2. Check login state
        if (!currentAuth || !currentUser || !currentToken) {
          if (!isMounted) return;
          setStatus('unauthenticated');
          setStatusMessage('Chưa đăng nhập. Đang chuyển hướng đến trang đăng nhập...');
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}&error=unauthenticated`);
          return;
        }

        // 3. Check token expiry & attempt refresh
        if (isJwtExpired(currentToken)) {
          if (currentRefreshToken) {
            try {
              if (isMounted) setStatusMessage('Phiên làm việc sắp hết hạn. Đang làm mới...');
              const refreshRes = await fetchApi<any>('/Authentication/refresh-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: currentRefreshToken })
              });

              if (refreshRes && refreshRes.accessToken) {
                setTokens(refreshRes.accessToken, refreshRes.refreshToken);
                currentToken = refreshRes.accessToken;
              } else {
                throw new Error('Refresh token invalid');
              }
            } catch {
              if (!isMounted) return;
              logout();
              setStatus('unauthenticated');
              setStatusMessage('Phiên làm việc đã hết hạn. Đang chuyển hướng...');
              router.replace(`/login?redirect=${encodeURIComponent(pathname)}&error=expired`);
              return;
            }
          } else {
            if (!isMounted) return;
            logout();
            setStatus('unauthenticated');
            setStatusMessage('Phiên làm việc đã hết hạn. Đang chuyển hướng...');
            router.replace(`/login?redirect=${encodeURIComponent(pathname)}&error=expired`);
            return;
          }
        }

        // 4. Check role validity
        const userRole = currentUser.roleCode || currentUser.role_id;
        if (!isAuthorizedAdminRole(userRole)) {
          if (!isMounted) return;
          setStatus('unauthorized');
          setStatusMessage('Tài khoản của bạn không có quyền truy cập trang quản trị. Đang chuyển hướng...');
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}&error=unauthorized`);
          return;
        }

        // 5. Authorized
        if (isMounted) {
          setStatus('authorized');
        }
      } finally {
        isVerifyingRef.current = false;
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, logout, setTokens]);

  // While checking, or if unauthorized/unauthenticated, render protected loading screen
  if (status !== 'authorized') {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-900 text-white select-none">
        <div className="relative mb-6">
          <div className="h-16 w-16 rounded-2xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center animate-pulse">
            {status === 'unauthorized' ? (
              <ShieldAlert className="h-8 w-8 text-rose-500" />
            ) : (
              <ShieldCheck className="h-8 w-8 text-brand-primary" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1">
            <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
          </div>
        </div>
        <h2 className="text-sm font-black tracking-widest uppercase text-slate-100 mb-2">
          HỆ THỐNG QUẢN TRỊ HƯNG THỊNH
        </h2>
        <p className="text-xs font-semibold text-slate-400 tracking-wide">
          {statusMessage}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
