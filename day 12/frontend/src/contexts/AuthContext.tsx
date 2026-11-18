import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi, getToken, setToken, removeToken } from "@/lib/api";

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string;
};

type AuthCtx = {
  session: { access_token: string; user: AuthUser } | null;
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (token: string, user: AuthUser) => void;
};

const AuthContext = createContext<AuthCtx>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<{ access_token: string; user: AuthUser } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.getMe()
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          setSession({ access_token: token, user: res.user });
        } else {
          removeToken();
        }
      })
      .catch(() => {
        removeToken();
        setUser(null);
        setSession(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signIn = (token: string, userData: AuthUser) => {
    setToken(token);
    setUser(userData);
    setSession({ access_token: token, user: userData });
  };

  const signOut = async () => {
    removeToken();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
