import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const TOKEN_KEY = "finance-tracker-token";
const USER_KEY = "finance-tracker-user";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY);

  if (!token || !userJson) {
    return { token: null, user: null };
  }

  try {
    return { token, user: JSON.parse(userJson) };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }
};

const extractMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.code === "ERR_NETWORK") {
    return "Cannot reach the backend server. Start the API on http://localhost:5000 and try again.";
  }

  return "Something went wrong. Please try again.";
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({ token: null, user: null });
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    setAuthState(getStoredUser());
    setAuthReady(true);
  }, []);

  const persistSession = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuthState({ token, user });
  };

  const login = async (payload) => {
    try {
      const { data } = await api.post("/auth/login", payload);
      persistSession(data.token, data.user);
      return data;
    } catch (error) {
      throw new Error(extractMessage(error));
    }
  };

  const register = async (payload) => {
    try {
      const { data } = await api.post("/auth/register", payload);
      persistSession(data.token, data.user);
      return data;
    } catch (error) {
      throw new Error(extractMessage(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuthState({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        authReady,
        isAuthenticated: Boolean(authState.token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
