import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BillingInfo {
  type: "company" | "individual";
  company?: {
    registrationNumber: string;
    taxId: string;
    statisticalId: string;
    articleCode: string;
  };
  individual?: {
    fullName: string;
    billingAddress: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  billingInfo?: BillingInfo;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const API_URL = process.env.REACT_APP_API_URL;

export const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const token = sessionStorage.getItem("token");
    const refreshToken = sessionStorage.getItem("refreshToken");
    const userStr = sessionStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return {
      user,
      token,
      refreshToken,
      isAuthenticated: !!token && !!user,
    };
  });

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          await fetchUser(token);
        } catch (error) {
          console.error("Erreur lors de l'initialisation:", error);
          clearAuth();
        }
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Surveiller les changements d'état d'authentification
  useEffect(() => {
    console.log("useAuth: État d'authentification changé:", auth);
  }, [auth]);

  const clearAuth = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    setAuth({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
    setIsLoading(false);
  };

  const updateAuthState = async (
    user: User | null,
    token: string | null,
    refreshToken: string | null
  ) => {
    if (token && user) {
      sessionStorage.setItem("token", token);
      if (refreshToken) {
        sessionStorage.setItem("refreshToken", refreshToken);
      }
      sessionStorage.setItem("user", JSON.stringify(user));
      setAuth({
        user,
        token,
        refreshToken,
        isAuthenticated: true,
      });
    } else {
      clearAuth();
    }
  };

  const refreshToken = async () => {
    try {
      if (!auth.refreshToken) {
        return false;
      }

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: auth.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await updateAuthState(
          auth.user,
          data.data.accessToken,
          auth.refreshToken
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return false;
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        await updateAuthState(data.data.user, token, auth.refreshToken);
      } else if (response.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          throw new Error("Token invalide");
        }
      } else {
        throw new Error(
          "Erreur lors de la récupération des informations utilisateur"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations utilisateur:",
        error
      );
      clearAuth();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("useAuth: Envoi de la requête de connexion");
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("useAuth: Réponse reçue:", data);

      if (response.ok) {
        console.log("useAuth: Connexion réussie");
        const { accessToken, refreshToken, user } = data.data;
        await updateAuthState(user, accessToken, refreshToken);
        return { success: true };
      } else {
        console.log("useAuth: Erreur de connexion:", data.error);
        return {
          success: false,
          error: data.error || "Une erreur est survenue",
        };
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      console.log("Envoi de la requête de changement de mot de passe");
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      console.log("Réponse du serveur (changePassword):", data);

      if (response.ok) {
        return { success: true };
      }

      return {
        success: false,
        error:
          data.error ||
          "Une erreur est survenue lors du changement de mot de passe",
      };
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    }
  };

  const updateProfile = async (name: string, email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        await updateAuthState(data.data.user, auth.token, auth.refreshToken);
        return { success: true };
      } else {
        return {
          success: false,
          error:
            data.error ||
            "Une erreur est survenue lors de la mise à jour du profil",
        };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      const response = await fetch(`${API_URL}/auth/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        await updateAuthState(data.data.user, auth.token, auth.refreshToken);
        return { success: true };
      } else {
        return {
          success: false,
          error: data.error || "Une erreur est survenue lors de la mise à jour",
        };
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return {
        success: false,
        error: "Erreur de connexion au serveur",
      };
    }
  };

  return {
    ...auth,
    isLoading,
    login,
    logout,
    fetchUser,
    updateProfile,
    changePassword,
    updateUser,
  };
};
