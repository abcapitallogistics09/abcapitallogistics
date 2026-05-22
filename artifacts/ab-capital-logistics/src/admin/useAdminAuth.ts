import { useState, useEffect, useCallback } from "react";

export interface AdminUser {
  username: string;
  role: string; // super_admin | admin | staff | custom
  permissions: string[];
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { username: string; role: string; permissions: string[] } | null) => {
        if (data) {
          setUser({ username: data.username, role: data.role, permissions: data.permissions ?? [] });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  /** True if the user can access a given section key */
  const hasPermission = useCallback(
    (section: string): boolean => {
      if (!user) return false;
      if (user.role === "super_admin") return true;
      return user.permissions.includes(section);
    },
    [user]
  );

  return { user, isLoading, logout, hasPermission };
}
