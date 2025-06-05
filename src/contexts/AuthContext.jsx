import {createContext, useContext, useEffect, useState} from "react";
import {auth, googleProvider} from "../lib/firebase";
import {
  onIdTokenChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import {API_URL_USER_INFO} from "../config/api";
import useUserLoginStore from "../hooks/useUserLoginStore";

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {setCompanies, saveUserToken, setUserRole} = useUserLoginStore();

  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (rawUser) => {
      if (!rawUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await rawUser.getIdToken(true);

        const res = await fetch(API_URL_USER_INFO, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("Usuario no autorizado");
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await res.json();

        setUser({
          uid: data.uid,
          email: data.email,
          role: data.role,
          name: data.name,
          companies: data.companies,
          token,
        });
        setCompanies(data.companies);
        setUserRole(data.role);
        saveUserToken(token);
      } catch (err) {
        console.error("Error al verificar el token:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const signInGoogle = async (useRedirect = false) => {
    setLoading(true);
    try {
      if (useRedirect) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, loading, signInGoogle, logout}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
