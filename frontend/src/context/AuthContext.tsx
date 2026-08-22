import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  user_id: number;
  email: string;
  name: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const storedToken = window.localStorage.getItem("token");
      const storedUser = window.localStorage.getItem("user");
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((nextToken: string, nextUser: AuthUser) => {
    window.localStorage.setItem("token", nextToken);
    window.localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, ready, signIn, signOut }),
    [user, token, ready, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
