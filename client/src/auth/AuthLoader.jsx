import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "../redux/slices/authSlice";
import { userApi } from "../api/api";

export default function AuthLoader({ children }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreUser = async () => {
      try {
        const res = await userApi.get("/me", {
          withCredentials: true,
        });

        if (isMounted && res.data?.user) {
          dispatch(loginSuccess(res.data.user));
        }
      } catch (err) {
        // logout only if unauthorized
        if (err.response?.status === 401 && isMounted) {
          dispatch(logout());
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreUser();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  // 🔥 Prevent UI flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return children;
}
