// AuthContext: manages token + current user, bridges to auth use cases.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { APP } from '../../core/config/constants.js';
import { LoginUseCase, LogoutUseCase, GetProfileUseCase } from '../../application/auth/AuthUseCases.js';
import { toPublicUser } from '../../core/domain/entities/User.js';

const AuthContext = createContext(null);

function readStored() {
  try {
    const token = localStorage.getItem(APP.TOKEN_KEY);
    const user = localStorage.getItem(APP.USER_KEY);
    return { token, user: user ? JSON.parse(user) : null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const initial = readStored();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);
  const [loading, setLoading] = useState(!!initial.token);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    if (nextToken) localStorage.setItem(APP.TOKEN_KEY, nextToken);
    else localStorage.removeItem(APP.TOKEN_KEY);
    if (nextUser) localStorage.setItem(APP.USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(APP.USER_KEY);
  }, []);

  // On mount: validate token + fetch profile.
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const useCase = new GetProfileUseCase();
      const result = await useCase.execute({ token });
      if (cancelled) return;
      if (result.isSuccess && result.value) {
        persist(token, result.value);
      } else {
        persist(null, null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(
    async (email, password) => {
      const useCase = new LoginUseCase();
      const result = await useCase.execute({ email, password });
      if (result.isSuccess) {
        persist(result.value.token, result.value.user);
      }
      return result;
    },
    [persist],
  );

  const logout = useCallback(async () => {
    const useCase = new LogoutUseCase();
    await useCase.execute();
    persist(null, null);
  }, [persist]);

  const updateUser = useCallback(
    (next) => {
      const nextUser = typeof next === 'function' ? next(user) : next;
      persist(token, toPublicUser ? nextUser : nextUser);
    },
    [persist, token, user],
  );

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === 'ADMIN',
      isCommercial: user?.role === 'COMMERCIAL',
      login,
      logout,
      updateUser,
    }),
    [user, token, loading, login, logout, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}