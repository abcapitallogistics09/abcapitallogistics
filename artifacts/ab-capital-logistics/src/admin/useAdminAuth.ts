import { useState, useEffect, useCallback } from "react";

interface AdminUser {
  username: string;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { username: string } | null) => {
        setUser(data ? { username: data.username } : null);
      })
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  return { user, isLoading, logout };
}
