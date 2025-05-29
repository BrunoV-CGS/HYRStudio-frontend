import {useAuth} from "../contexts/AuthContext";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function LoginButton() {
  const {user, loading, signInGoogle, logout} = useAuth();
  const navigate = useNavigate();

  // ✅ Redirigir al dashboard cuando tengamos usuario
  useEffect(() => {
    if (!loading && user?.uid) {
      navigate(`/company-selection/${user.uid}`);
    }
  }, [user, loading, navigate]);

  if (loading) return <span>Cargando…</span>;

  return user ? (
    <button onClick={logout}>
      Cerrar sesión ({user.email ?? user.uid.slice(0, 6)})
    </button>
  ) : (
    <button
      onClick={() => signInGoogle()}
      className='flex w-4/12 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    >
      Sign in
    </button>
  );
}
